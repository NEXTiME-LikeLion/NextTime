import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useNextTime } from "../../contexts/NextTimeContext";
import { COMPLETE_CONTENT } from "../../data/nextTimeMock";
import Header from "../../components/next-time/Header";
import MascotCharacter from "../../components/next-time/MascotCharacter";
import PrimaryButton from "../../components/next-time/PrimaryButton";

function CompletePage() {
  const COMPLETE_CONTENT = {
    title: "방금의 기록 기억해둘게요",
    subtitle: "다음에 비슷한 순간이 오면\n오늘의 기록을 먼저 참고할게요",
    insightTitle: "💡 다음에는 이렇게 기억할게요",
    insightText:
      "퇴근 후 욕구가 강할 때, 일단 흡연구역에서 벗어나면 흡연 욕구 강함에서 보통으로 낮아졌어요.",
  };

  const navigate = useNavigate();
  const { resetFlow } = useNextTime();

  const handleBack = () => {
    resetFlow();
    navigate(-1);
  };

  const handleGoPattern = () => {
    resetFlow();
    navigate("/pattern");
  };

  const handleGoHome = () => {
    resetFlow();
    navigate("/");
  };

  return (
    <PageContainer>
      <Header title="" onBack={handleBack} />

      <Content>
        <TextBlock>
          <Title>{COMPLETE_CONTENT.title}</Title>
          <Subtitle>{COMPLETE_CONTENT.subtitle}</Subtitle>
        </TextBlock>

        <MascotCharacter mood="success" size="llg" />

        <InsightBox>
          <InsightTitle>{COMPLETE_CONTENT.insightTitle}</InsightTitle>
          <InsightBody>{COMPLETE_CONTENT.insightText}</InsightBody>
        </InsightBox>
      </Content>

      <BottomArea>
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
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  padding-block: 1.25rem;
  min-height: 0;
  overflow-y: auto;
  margin-top: 2.87rem;
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
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding-inline: 0.94rem;
  padding-bottom: 2.25rem;
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
