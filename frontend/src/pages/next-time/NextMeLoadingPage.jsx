import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { NEXT_ME_LOADING } from "../../data/nextTimeMock";
import Header from "../../components/next-time/Header";
import MascotCharacter from "../../components/next-time/MascotCharacter";

const LOADING_DURATION_MS = 2500;

function NextMeLoadingPage() {
  const navigate = useNavigate();

  // TODO: 실제 추천 API 연동 시
  // useEffect(() => {
  //   fetchRecommendation(contextValues).then((res) => {
  //     setRecommendedMission(res);
  //     navigate('/next-time/recommend');
  //   });
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/next-time/recommend");
    }, LOADING_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBack = () => {
    navigate("/next-time/context");
  };

  return (
    <PageContainer>
      <Header
        title="NEXT ME"
        subtitle="미래의 목소리"
        onBack={handleBack}
      />

      <Content>
        <TextGroup>
          <HighlightLine $delay={0}>{NEXT_ME_LOADING.lines[0]}</HighlightLine>
          <BodyLine $delay={0.4}>{NEXT_ME_LOADING.lines[1]}</BodyLine>
          <BoldLine $delay={0.8}>
            {NEXT_ME_LOADING.lines[2]}
            <br />
            {NEXT_ME_LOADING.lines[3]}
          </BoldLine>
        </TextGroup>

        <MascotWrap $delay={1.2}>
          <MascotCharacter mood="run" size="lg" />
        </MascotWrap>

        <ClosingLine $delay={1.6}>{NEXT_ME_LOADING.closingLine}</ClosingLine>
      </Content>

      <BottomArea>
        <LoadingBarTrack>
          <LoadingBarBg />
          <LoadingBarFill />
          <LoadingBarDot />
        </LoadingBarTrack>
        <LoadingText>{NEXT_ME_LOADING.statusText}</LoadingText>
      </BottomArea>
    </PageContainer>
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

const loadingFill = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 33%;
  }
`;

const loadingDot = keyframes`
  from {
    left: 0;
  }
  to {
    left: calc(33% - 0.375rem);
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 1.25rem;
  text-align: center;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

const FadeLine = styled.p`
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  word-break: keep-all;
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
  animation-delay: ${({ $delay }) => $delay}s, ${({ $delay }) => $delay + 0.6}s;
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
  padding: 0 1.1875rem 2.25rem;
`;

const LoadingBarTrack = styled.div`
  position: relative;
  width: 100%;
  height: 0.375rem;
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
  animation: ${loadingFill} ${LOADING_DURATION_MS}ms ease-out forwards;
`;

const LoadingBarDot = styled.div`
  position: absolute;
  top: 0;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  animation: ${loadingDot} ${LOADING_DURATION_MS}ms ease-out forwards;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.light_gray};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
`;
