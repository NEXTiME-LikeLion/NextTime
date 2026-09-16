import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./MissionPage.styles";
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
import useSkipNextTimeMission from "../../hooks/useSkipNextTimeMission";
import useRewindNextTimeSession from "../../hooks/useRewindNextTimeSession";
import { debugLog, debugError } from "../../api/debugLog";

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
  const { title, missionDescription, durationSeconds, whyThisText, startedAt } =
    recommendedMission;
  const titleLines = splitMissionTitle(title);
  const missionDescriptionLines = missionDescription?.split("\n") ?? [];
  const {
    isLoading: isCompleting,
    error: completeError,
    execute,
  } = useAsync(completeNextTimeMission, { immediate: false });
  const {
    skip,
    isLoading: isSkipping,
    error: skipError,
  } = useSkipNextTimeMission({ isBusy: isCompleting });
  const {
    rewind,
    isLoading: isRewinding,
    error: rewindError,
    hasStartedRef: hasRewindStartedRef,
  } = useRewindNextTimeSession({ isBusy: isCompleting || isSkipping });
  const isLoading = isCompleting || isSkipping || isRewinding;
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
      debugError("nextTime", "세션 ID가 없어 미션을 완료할 수 없습니다.");
      return;
    }

    if (isNextTimeStatusAfter(session?.status, "MISSION_STARTED")) {
      const path = getNextTimePathByStatus(session.status);
      debugLog(
        "nextTime",
        "세션이 이미 미션 시작 이후 단계라 미션 완료를 건너뜁니다.",
        {
          sessionId,
          status: session.status,
          path,
          session,
        },
      );
      if (session.status === "MISSION_COMPLETED") {
        goToRecord(session);
        return;
      }
      navigate(path, { replace: true });
      return;
    }

    debugLog("nextTime", "미션을 완료합니다.", { sessionId });
    const result = await execute(sessionId);
    if (!result) {
      debugError("nextTime", "미션 완료에 실패했습니다.", completeError);
      return;
    }

    debugLog("nextTime", "미션을 완료했습니다.", {
      sessionId: result.sessionId,
      status: result.status,
      mission: result.mission,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      result,
    });
    goToRecord(result);
  }, [
    completeError,
    execute,
    goToRecord,
    hasRewindStartedRef,
    isLoading,
    navigate,
    session,
    sessionId,
  ]);

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
    <S.PageContainer>
      <Header title="NEXT TIME" back={false} />

      <S.AllContent>
        <S.Box>
          <S.Content>
            <S.StatusLabel>미션 진행 중</S.StatusLabel>

            <S.MissionTitle>
              {titleLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </S.MissionTitle>

            <CircularTimer
              totalSeconds={durationSeconds}
              remainingSeconds={Math.max(0, remainingSeconds)}
              showRemainingLabel
            />

            <S.Description>
              {missionDescriptionLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </S.Description>
          </S.Content>

          {whyThisText && <WhyThisBox text={whyThisText} />}
        </S.Box>

        <S.BottomArea>
          <S.SkipButton type="button" disabled={isLoading} onClick={handleSkip}>
            건너뛰기
          </S.SkipButton>
        </S.BottomArea>
      </S.AllContent>
    </S.PageContainer>
  );
}

export default MissionPage;
