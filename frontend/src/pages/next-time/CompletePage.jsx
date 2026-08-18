import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useElementHeight } from "../../hooks/useElementHeight";
import { useNextTime } from "../../contexts/NextTimeContext";
import Header from "../../components/next-time/Header";
import MascotCharacter from "../../components/next-time/MascotCharacter";
import PrimaryButton from "../../components/next-time/PrimaryButton";

function CompletePage() {
  const COMPLETE_CONTENT = {
    title: "방금의 기록 기억해둘게요",
    subtitle: "다음에 비슷한 순간이 오면\n오늘의 기록을 먼저 참고할게요",
    insightTitle: "💡 다음에는 이렇게 기억할게요",
  };

  const navigate = useNavigate();
  const { session, resetFlow } = useNextTime();
  const [bottomAreaRef, bottomAreaHeight] = useElementHeight();
  const insightText = session?.memorySummary;

  const handleGoPattern = () => {
    resetFlow();
    navigate("/main/pattern", { replace: true });
  };

  const handleGoHome = () => {
    resetFlow();
    navigate("/main", { replace: true });
  };

  return (
    <PageContainer>
      <Header title="" onBack={handleGoHome} />

      <Content $bottomAreaHeight={bottomAreaHeight}>
        <TextBlock>
          <Title>{COMPLETE_CONTENT.title}</Title>
          <Subtitle>{COMPLETE_CONTENT.subtitle}</Subtitle>
        </TextBlock>

        <MascotCharacter mood="success" size="llg" />

        {insightText ? (
          <InsightBox>
            <InsightTitle>{COMPLETE_CONTENT.insightTitle}</InsightTitle>
            <InsightBody>{insightText}</InsightBody>
          </InsightBox>
        ) : null}
      </Content>

      <BottomArea ref={bottomAreaRef}>
        <PrimaryButton variant="primary" onClick={handleGoPattern}>
          내 패턴 보러가기
        </PrimaryButton>
        <SkipButton type="button" onClick={handleGoHome}>
          홈으로 가기
        </SkipButton>
      </BottomArea>
    </PageContainer>
  );
}

export default CompletePage;

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
  gap: 1.75rem;
  min-height: 0;
  overflow-y: auto;
  margin-top: 2.87rem;
  padding-top: 1.25rem;
  padding-bottom: ${({ $bottomAreaHeight }) => $bottomAreaHeight}rem;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
`;

const InsightBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  background: rgba(247, 247, 250, 0.1);
  word-break: keep-all;
`;

const InsightTitle = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.4;
`;

const InsightBody = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
`;

const BottomArea = styled.div`
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  bottom: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding-inline: 0.94rem;
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
