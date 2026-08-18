import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { useNextTime } from "../../contexts/NextTimeContext";
import { getMockRecommendation, NEXT_ME_LOADING } from "../../data/nextTimeMock";
import { generateFutureVoice } from "../../api/nextTime";
import useAsync from "../../hooks/useAsync";
import Header from "../../components/next-time/Header";
import MascotCharacter from "../../components/next-time/MascotCharacter";
import ApiStatusView from "../../components/common/ApiStatusView";

const TEXT_REVEAL_MS = 2200;

function NextMeLoadingPage() {
  const navigate = useNavigate();
  const {
    sessionId,
    situationIntensity,
    location,
    moment,
    setSession,
    setFutureVoice,
    setRecommendedMission,
  } = useNextTime();
  const { data, isLoading, error, execute, refetch } = useAsync(
    generateFutureVoice,
    { immediate: false },
  );

  const missingSessionError = sessionId
    ? null
    : {
        response: {
          data: { message: "세션 정보가 없어요. 홈에서 다시 시작해 주세요." },
        },
      };

  const goToRecommend = useCallback(
    (voice) => {
      const { elapsedMs: _elapsedMs, ...sessionVoice } = voice;
      setSession((prev) => ({ ...(prev ?? {}), ...sessionVoice }));
      setFutureVoice(sessionVoice);
      setRecommendedMission(
        getMockRecommendation({
          situationIntensity,
          location,
          moment,
        }),
      );
      navigate("/next-time/recommend", { replace: true });
    },
    [
      location,
      moment,
      navigate,
      setFutureVoice,
      setRecommendedMission,
      setSession,
      situationIntensity,
    ],
  );

  useEffect(() => {
    if (!sessionId) {
      console.error("세션 ID가 없어 미래의 목소리를 생성할 수 없습니다.");
      return;
    }

    console.log("미래의 목소리를 생성합니다.", { sessionId });
    execute(sessionId).then((result) => {
      if (!result) {
        console.error("미래의 목소리 생성에 실패했습니다.");
        return;
      }

      console.log("미래의 목소리를 생성했습니다.", {
        sessionId: result.sessionId,
        source: result.source,
        elapsedMs: result.elapsedMs,
        generatedAt: result.generatedAt,
        result,
      });
    });
  }, [execute, sessionId]);

  useEffect(() => {
    if (!data) return;

    const displayDurationMs = TEXT_REVEAL_MS;
    console.log("미래의 목소리를 표시한 뒤 다음 화면으로 이동합니다.", {
      elapsedMs: data.elapsedMs,
      displayDurationMs,
    });

    const timer = setTimeout(() => {
      goToRecommend(data);
    }, displayDurationMs);

    return () => clearTimeout(timer);
  }, [data, goToRecommend]);

  const handleRetry = async () => {
    if (!sessionId) return;

    console.log("미래의 목소리 생성을 다시 시도합니다.", { sessionId });
    const result = await refetch();
    if (!result) {
      console.error("미래의 목소리 생성에 실패했습니다.");
      return;
    }

    console.log("미래의 목소리를 생성했습니다.", {
      sessionId: result.sessionId,
      source: result.source,
      elapsedMs: result.elapsedMs,
      generatedAt: result.generatedAt,
      result,
    });
  };

  const handleBack = () => {
    if (isLoading) return;
    navigate("/next-time/context", { replace: true });
  };

  return (
    <ApiStatusView
      variant="dark"
      isLoading={false}
      error={missingSessionError || error}
      onRetry={sessionId ? handleRetry : undefined}
      errorTitle="미래의 목소리를 만들지 못했어요"
    >
      <PageContainer>
        <Header title="NEXT ME" subtitle="미래의 목소리" onBack={handleBack} />

        <Content>
          <TextGroup>
            {data ? (
              <>
                <HighlightLine $delay={0}>{data.futureHook}</HighlightLine>
                <BodyLine $delay={0.4}>{data.acknowledge}</BodyLine>
                <BoldLine $delay={0.8}>{data.futureReason}</BoldLine>
              </>
            ) : null}
          </TextGroup>

          <MascotWrap $delay={data ? 1.2 : 0} $immediate={!data}>
            <MascotCharacter mood="run" size="lg" />
          </MascotWrap>

          {data ? (
            <ClosingLine $delay={1.6}>{data.closing}</ClosingLine>
          ) : null}
        </Content>

        <BottomArea>
          <LoadingBarTrack>
            <LoadingBarBg />
            <LoadingBarFill $isComplete={Boolean(data)} />
            <LoadingBarDot $isComplete={Boolean(data)} />
          </LoadingBarTrack>
          <LoadingText>{NEXT_ME_LOADING.statusText}</LoadingText>
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

const loadingPulse = keyframes`
  0% {
    width: 8%;
  }
  50% {
    width: 24%;
  }
  100% {
    width: 8%;
  }
`;

const loadingDotPulse = keyframes`
  0% {
    left: 0;
  }
  50% {
    left: calc(24% - 0.375rem);
  }
  100% {
    left: 0;
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding-inline: 1.25rem;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding-block: 1.25rem;
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
  opacity: ${({ $immediate }) => ($immediate ? 1 : 0)};
  animation:
    ${fadeInUp} 0.6s ease forwards,
    ${runMotion} 0.6s ease-in-out infinite;
  animation-delay: ${({ $delay, $immediate }) =>
      $immediate ? "0s" : `${$delay}s`},
    ${({ $delay, $immediate }) =>
      $immediate ? "0.6s" : `${$delay + 0.6}s`};
`;

const ClosingLine = styled(FadeLine)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
`;

const BottomArea = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3.56rem;
`;

const LoadingBarTrack = styled.div`
  position: relative;
  width: 100%;
  height: 0.125rem;
`;

const LoadingBarBg = styled.div`
  position: absolute;
  top: 0.125rem;
  left: 0;
  width: 100%;
  height: 0.125rem;
  border-radius: 6.25rem;
  background: rgba(178, 178, 178, 0.8);
`;

const LoadingBarFill = styled.div`
  position: absolute;
  top: 0.125rem;
  left: 0;
  height: 0.125rem;
  border-radius: 6.25rem;
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ $isComplete }) => ($isComplete ? "33%" : "8%")};
  transition: width 0.4s ease-out;
  animation: ${({ $isComplete }) =>
    $isComplete
      ? "none"
      : css`
          ${loadingPulse} 1.4s ease-in-out infinite
        `};
`;

const LoadingBarDot = styled.div`
  position: absolute;
  top: 0;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  left: ${({ $isComplete }) =>
    $isComplete ? "calc(33% - 0.375rem)" : "0"};
  transition: left 0.4s ease-out;
  animation: ${({ $isComplete }) =>
    $isComplete
      ? "none"
      : css`
          ${loadingDotPulse} 1.4s ease-in-out infinite
        `};
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.light_gray};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
`;
