import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useNextTime } from "../../contexts/NextTimeContext";
import useAsync from "../../hooks/useAsync";
import useNextTimeStatusRedirect from "../../hooks/useNextTimeStatusRedirect";
import {
  completeNextTimeMission,
  getNextTimePathByStatus,
  isNextTimeStatusAfter,
} from "../../api/nextTime";
import Header from "../../components/next-time/Header";
import CircularTimer from "../../components/next-time/CircularTimer";
import WhyThisBox from "../../components/next-time/WhyThisBox";
import ApiStatusView from "../../components/common/ApiStatusView";
import useSkipNextTimeMission from "../../hooks/useSkipNextTimeMission";
import useRewindNextTimeSession from "../../hooks/useRewindNextTimeSession";

function splitMissionTitle(title) {
  if (!title) return [""];
  const splitIndex = title.search(/\d+분/);
  if (splitIndex > 0) {
    return [title.slice(0, splitIndex).trim(), title.slice(splitIndex).trim()];
  }
  return [title];
}

function getRemainingSeconds(durationSeconds, startedAt) {
  if (!startedAt) return durationSeconds;

  const elapsedSeconds = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / 1000,
  );
  return Math.max(0, durationSeconds - elapsedSeconds);
}

function MissionPage() {
  const navigate = useNavigate();
  const { session, sessionId, recommendedMission, setSession } = useNextTime();
  useNextTimeStatusRedirect("MISSION_STARTED");
  const {
    title,
    missionDescription,
    durationSeconds,
    whyThisText,
    startedAt,
  } = recommendedMission;
  const titleLines = splitMissionTitle(title);
  const missionDescriptionLines = missionDescription?.split("\n") ?? [];
  const {
    isLoading: isCompleting,
    error: completeError,
    execute,
    refetch,
  } = useAsync(
    completeNextTimeMission,
    { immediate: false },
  );
  const {
    skip,
    retry: retrySkip,
    isLoading: isSkipping,
    error: skipError,
  } = useSkipNextTimeMission({ isBusy: isCompleting });
  const {
    rewind,
    retry: retryRewind,
    isLoading: isRewinding,
    error: rewindError,
    hasStartedRef: hasRewindStartedRef,
  } = useRewindNextTimeSession({ isBusy: isCompleting || isSkipping });
  const isLoading = isCompleting || isSkipping || isRewinding;
  const error = rewindError || skipError || completeError;
  const hasRequestedCompleteRef = useRef(false);

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(durationSeconds, startedAt),
  );

  const goToRecord = useCallback(
    (completedSession) => {
      if (completedSession) {
        setSession((prev) => ({ ...(prev ?? {}), ...completedSession }));
      }
      navigate("/next-time/record", { replace: true });
    },
    [navigate, setSession],
  );

  const completeMission = useCallback(async () => {
    if (isLoading || hasRewindStartedRef.current) return;

    if (!sessionId) {
      console.error("세션 ID가 없어 미션을 완료할 수 없습니다.");
      return;
    }

    if (isNextTimeStatusAfter(session?.status, "MISSION_STARTED")) {
      const path = getNextTimePathByStatus(session.status);
      console.log("세션이 이미 미션 시작 이후 단계라 미션 완료를 건너뜁니다.", {
        sessionId,
        status: session.status,
        path,
        session,
      });
      if (session.status === "MISSION_COMPLETED") {
        goToRecord(session);
        return;
      }
      navigate(path, { replace: true });
      return;
    }

    console.log("미션을 완료합니다.", { sessionId });
    const result = await execute(sessionId);
    if (!result) {
      console.error("미션 완료에 실패했습니다.");
      return;
    }

    console.log("미션을 완료했습니다.", {
      sessionId: result.sessionId,
      status: result.status,
      mission: result.mission,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      result,
    });
    goToRecord(result);
  }, [
    execute,
    goToRecord,
    hasRewindStartedRef,
    isLoading,
    navigate,
    session,
    sessionId,
  ]);

  const handleRetry = async () => {
    if (rewindError) {
      await retryRewind();
      return;
    }

    if (skipError) {
      await retrySkip();
      return;
    }

    console.log("미션 완료를 다시 시도합니다.", { sessionId });
    const result = await refetch();
    if (!result) {
      console.error("미션 완료에 실패했습니다.");
      return;
    }

    console.log("미션을 완료했습니다.", {
      sessionId: result.sessionId,
      status: result.status,
      mission: result.mission,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      result,
    });
    goToRecord(result);
  };

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const intervalId = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (
      remainingSeconds > 0 ||
      isSkipping ||
      isRewinding ||
      hasRewindStartedRef.current ||
      skipError ||
      rewindError ||
      hasRequestedCompleteRef.current
    ) {
      return;
    }

    hasRequestedCompleteRef.current = true;
    completeMission();
  }, [
    completeMission,
    isRewinding,
    isSkipping,
    remainingSeconds,
    rewindError,
    skipError,
  ]);

  const handleBack = () => {
    if (isLoading) return;
    rewind();
  };

  const handleSkip = () => {
    skip();
  };

  return (
    <ApiStatusView
      variant="dark"
      isLoading={isLoading}
      error={error}
      onRetry={handleRetry}
      loadingTitle={
        isRewinding
          ? "이전 화면으로 돌아가는 중이에요"
          : isSkipping
            ? "미션을 건너뛰는 중이에요"
            : "미션을 완료하는 중이에요"
      }
      errorTitle={
        rewindError
          ? "이전 화면으로 돌아가지 못했어요"
          : skipError
            ? "미션을 건너뛰지 못했어요"
            : "미션을 완료하지 못했어요"
      }
    >
    <PageContainer>
      <Header title="NEXT TIME" onBack={handleBack} />

      <AllContent>
        <Box>
          <Content>
            <StatusLabel>미션 진행 중</StatusLabel>

            <MissionTitle>
              {titleLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </MissionTitle>

            <CircularTimer
              totalSeconds={durationSeconds}
              remainingSeconds={Math.max(0, remainingSeconds)}
              showRemainingLabel
            />

            <Description>
              {missionDescriptionLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </Description>
          </Content>

          {whyThisText && <WhyThisBox text={whyThisText} />}
        </Box>

        <BottomArea>
          <SkipButton type="button" onClick={handleSkip}>
            건너뛰기
          </SkipButton>
        </BottomArea>
      </AllContent>
    </PageContainer>
    </ApiStatusView>
  );
}

export default MissionPage;

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding-inline: 1.25rem;
`;

const AllContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow-y: auto;
`;

const Box = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-block: 1.25rem;
  min-height: 0;
  margin-top: 2.44rem;
`;

const StatusLabel = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
`;

const MissionTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;

  p {
    margin: 0;
  }
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;

  p {
    margin: 0;
  }
`;

const BottomArea = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  margin-bottom: 2.06rem;
  padding-inline: 0.94rem;
  background: transparent;

  & > button {
    opacity: 0.92;
  }
`;

const SkipButton = styled.button`
  width: 100%;
  height: 3.5rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  cursor: pointer;
`;
