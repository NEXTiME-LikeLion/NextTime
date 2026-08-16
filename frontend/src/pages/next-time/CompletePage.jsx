import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useNextTime } from "../../contexts/NextTimeContext";
import { COMPLETE_CONTENT } from "../../data/nextTimeMock";
import Header from "../../components/next-time/Header";
import MascotCharacter from "../../components/next-time/MascotCharacter";
import PrimaryButton from "../../components/next-time/PrimaryButton";

function CompletePage() {
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

        <MascotCharacter mood="success" size="lg" />

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
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  padding: 1.25rem;
  min-height: 0;
  overflow-y: auto;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  word-break: keep-all;
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
  padding: 0 2.1875rem 2.25rem;
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
