import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useNextTime } from "../../contexts/NextTimeContext";
import {
  generateFutureVoice,
  getNextTimePathByStatus,
  getNextTimeRecommendation,
  isNextTimeStatusAfter,
  mapRecommendedMission,
} from "../../api/nextTime";
import useAsync from "../../hooks/useAsync";
import useNextTimeStatusRedirect from "../../hooks/useNextTimeStatusRedirect";
import useRewindNextTimeSession from "../../hooks/useRewindNextTimeSession";
import { useElementHeight } from "../../hooks/useElementHeight";
import Header from "../../components/next-time/Header";
import MascotCharacter from "../../components/next-time/MascotCharacter";
import PrimaryButton from "../../components/next-time/PrimaryButton";
import ApiStatusView from "../../components/common/ApiStatusView";

function NextMeLoadingPage() {
  const navigate = useNavigate();
  const { session, sessionId, setSession, setFutureVoice, setRecommendedMission } =
    useNextTime();
  useNextTimeStatusRedirect("CONTEXT_SAVED");
  const {
    error: voiceError,
    execute: executeVoice,
    refetch: refetchVoice,
  } = useAsync(generateFutureVoice, { immediate: false });
  const {
    isLoading: isRecommending,
    error: recommendError,
    execute: executeRecommend,
    refetch: refetchRecommend,
  } = useAsync(getNextTimeRecommendation, { immediate: false });
  const {
    rewind,
    retry: retryRewind,
    isLoading: isRewinding,
    error: rewindError,
    hasStartedRef: hasRewindStartedRef,
  } = useRewindNextTimeSession({ isBusy: isRecommending });
  const isBusy = isRewinding || isRecommending;
  const [voice, setVoice] = useState(null);
  const [bottomAreaRef, bottomAreaHeight] = useElementHeight();
  const hasNavigatedRef = useRef(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const applyRecommendation = useCallback(
    (recommendation) => {
      if (!recommendation || hasRewindStartedRef.current) return null;

      const mission = mapRecommendedMission(recommendation);
      setSession((prev) => ({
        ...(prev ?? {}),
        ...recommendation,
      }));
      if (mission) {
        setRecommendedMission(mission);
      }
      return mission;
    },
    [hasRewindStartedRef, setRecommendedMission, setSession],
  );

  const applyVoice = useCallback(
    (voiceResult) => {
      if (!voiceResult || hasRewindStartedRef.current) return null;

      const { elapsedMs, ...sessionVoice } = voiceResult;
      console.log("미래의 목소리를 생성했습니다.", {
        sessionId: sessionVoice.sessionId,
        source: sessionVoice.source,
        elapsedMs,
        generatedAt: sessionVoice.generatedAt,
        result: sessionVoice,
      });

      setVoice(sessionVoice);
      setFutureVoice(sessionVoice);
      setSession((prev) => ({
        ...(prev ?? {}),
        ...sessionVoice,
        status: prev?.status ?? sessionVoice.status,
      }));
      return sessionVoice;
    },
    [hasRewindStartedRef, setFutureVoice, setSession],
  );

  const goToRecommend = useCallback(
    (recommendation) => {
      if (hasNavigatedRef.current || hasRewindStartedRef.current) return;
      if (!recommendation) return;

      const mission = applyRecommendation(recommendation);
      const nextSession = {
        ...(sessionRef.current ?? {}),
        ...recommendation,
      };
      hasNavigatedRef.current = true;
      setSession(nextSession);
      if (mission) {
        console.log("추천 화면으로 이동합니다.", { mission });
      }
      navigate("/next-time/recommend", {
        replace: true,
        state: { session: nextSession },
      });
    },
    [applyRecommendation, hasRewindStartedRef, navigate, setSession],
  );

  useEffect(() => {
    if (!sessionId) {
      console.error(
        "세션 ID가 없어 미래의 목소리를 요청할 수 없습니다.",
      );
      return;
    }

    if (hasRewindStartedRef.current) return;

    if (isNextTimeStatusAfter(sessionRef.current?.status, "CONTEXT_SAVED")) {
      const path = getNextTimePathByStatus(sessionRef.current.status);
      console.log("이미 추천이 끝난 세션이라 미래의 목소리 요청을 건너뜁니다.", {
        sessionId,
        status: sessionRef.current.status,
        path,
      });
      applyRecommendation(sessionRef.current);
      navigate(path, {
        replace: true,
        state: { session: sessionRef.current },
      });
      return;
    }

    let cancelled = false;
    const requestedSessionId = sessionId;

    console.log("미래의 목소리를 생성합니다.", { sessionId });
    executeVoice(sessionId).then((voiceResult) => {
      if (cancelled || hasRewindStartedRef.current) return;
      if (requestedSessionId !== sessionRef.current?.sessionId) return;
      if (!voiceResult) {
        console.error("미래의 목소리 요청에 실패했습니다.");
        return;
      }
      applyVoice(voiceResult);
    });

    return () => {
      cancelled = true;
    };
  }, [applyRecommendation, applyVoice, executeVoice, navigate, sessionId]);

  const requestRecommendation = async () => {
    if (isBusy || !voice) return;

    if (!sessionId) {
      console.error("세션 ID가 없어 추천 미션을 요청할 수 없습니다.");
      return;
    }

    if (isNextTimeStatusAfter(session?.status, "CONTEXT_SAVED")) {
      const path = getNextTimePathByStatus(session.status);
      console.log("세션이 이미 추천 이후 단계라 추천 요청을 건너뜁니다.", {
        sessionId,
        status: session.status,
        path,
        session,
      });
      if (session.status === "MISSION_RECOMMENDED") {
        goToRecommend(session);
        return;
      }
      navigate(path, { replace: true, state: session ? { session } : undefined });
      return;
    }

    console.log("추천 미션을 요청합니다.", { sessionId });
    const recommendation = await executeRecommend(sessionId);
    if (hasRewindStartedRef.current) return;
    if (!recommendation) {
      console.error("추천 미션 요청에 실패했습니다.");
      return;
    }

    console.log("추천 미션을 받았습니다.", {
      sessionId: recommendation.sessionId,
      status: recommendation.status,
      source: recommendation.source,
      mission: recommendation.mission,
      reason: recommendation.reason,
      result: recommendation,
    });
    goToRecommend(recommendation);
  };

  const handleRetry = async () => {
    if (rewindError) {
      await retryRewind();
      return;
    }

    if (recommendError) {
      console.log("추천 미션을 다시 요청합니다.", { sessionId });
      const recommendation = await refetchRecommend();
      if (hasRewindStartedRef.current) return;
      if (!recommendation) {
        console.error("추천 미션 요청에 실패했습니다.");
        return;
      }
      goToRecommend(recommendation);
      return;
    }

    if (!sessionId) return;

    if (hasRewindStartedRef.current) return;

    if (isNextTimeStatusAfter(session?.status, "CONTEXT_SAVED")) {
      applyRecommendation(session);
      navigate(getNextTimePathByStatus(session.status), {
        replace: true,
        state: session ? { session } : undefined,
      });
      return;
    }

    hasNavigatedRef.current = false;
    setVoice(null);
    console.log("미래의 목소리를 다시 요청합니다.", { sessionId });
    const voiceResult = await refetchVoice();
    if (hasRewindStartedRef.current) return;
    if (!voiceResult) {
      console.error("미래의 목소리 요청에 실패했습니다.");
      return;
    }
    applyVoice(voiceResult);
  };

  const handleBack = () => {
    if (isBusy) return;
    rewind();
  };

  const missingSessionError = sessionId
    ? null
    : {
        response: {
          data: { message: "세션 정보가 없어요. 홈에서 다시 시작해 주세요." },
        },
      };

  return (
    <ApiStatusView
      variant="dark"
      isLoading={isBusy}
      error={rewindError || missingSessionError || recommendError || voiceError}
      onRetry={
        rewindError ? retryRewind : sessionId ? handleRetry : undefined
      }
      loadingTitle={
        isRewinding
          ? "이전 화면으로 돌아가는 중이에요"
          : "미션을 추천하는 중이에요"
      }
      errorTitle={
        rewindError
          ? "이전 화면으로 돌아가지 못했어요"
          : recommendError
            ? "행동 추천에 실패했어요"
            : "미래의 목소리를 만들지 못했어요"
      }
    >
      <PageContainer>
        <Header title="NEXT ME" subtitle="미래의 목소리" onBack={handleBack} />

        <Content $bottomAreaHeight={bottomAreaHeight}>
          {voice ? (
            <>
              <TextGroup>
                <HighlightLine $delay={0.4}>{voice.futureHook}</HighlightLine>
                <BodyLine $delay={0.9}>{voice.acknowledge}</BodyLine>
                <BoldLine $delay={1.3}>{voice.futureReason}</BoldLine>
              </TextGroup>

              <MascotWrap $delay={1.6}>
                <MascotCharacter mood="run" size="lg" priority />
              </MascotWrap>

              <ClosingLine $delay={2.0}>{voice.closing}</ClosingLine>
            </>
          ) : null}
        </Content>

        <BottomArea ref={bottomAreaRef}>
          <PrimaryButton
            variant="primary"
            disabled={!voice || isBusy}
            onClick={requestRecommendation}
          >
            미션 추천받기
          </PrimaryButton>
        </BottomArea>
      </PageContainer>
    </ApiStatusView>
  );
}

export default NextMeLoadingPage;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const runMotion = keyframes`
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(0.5rem);
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding-inline: 1.25rem;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  min-height: 0;
  overflow-y: auto;
  padding-block: 1.25rem;
  padding-bottom: ${({ $bottomAreaHeight }) => $bottomAreaHeight}rem;
  text-align: center;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  word-break: keep-all;
`;

const FadeLine = styled.p`
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const HighlightLine = styled(FadeLine)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
`;

const BodyLine = styled(FadeLine)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
`;

const BoldLine = styled(FadeLine)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
`;

const MascotWrap = styled.div`
  opacity: 0;
  animation:
    ${fadeInUp} 0.6s ease forwards,
    ${runMotion} 0.6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => `${$delay}s`},
    ${({ $delay }) => `${$delay + 0.6}s`};
`;

const ClosingLine = styled(FadeLine)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
`;

const BottomArea = styled.div`
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  bottom: 0;
  padding-block: 2.5rem 2.25rem;

  background: linear-gradient(
    to bottom,
    rgba(10, 10, 20, 0) 0%,
    rgba(10, 10, 20, 0.85) 35%,
    rgba(10, 10, 20, 0.85) 100%
  );

  pointer-events: none;

  & > button {
    opacity: 0.92;
    pointer-events: auto;
  }
`;
