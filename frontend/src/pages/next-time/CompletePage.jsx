import * as S from "./CompletePage.styles";
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
    <S.PageContainer>
      <Header title="" back={false} />

      <S.Content $bottomAreaHeight={bottomAreaHeight}>
        <S.TextBlock>
          <S.Title>{COMPLETE_CONTENT.title}</S.Title>
          <S.Subtitle>{COMPLETE_CONTENT.subtitle}</S.Subtitle>
        </S.TextBlock>

        <MascotCharacter mood="success" size="llg" />

        {insightText ? (
          <S.InsightBox>
            <S.InsightTitle>{COMPLETE_CONTENT.insightTitle}</S.InsightTitle>
            <S.InsightBody>{insightText}</S.InsightBody>
          </S.InsightBox>
        ) : null}
      </S.Content>

      <S.BottomArea ref={bottomAreaRef}>
        <PrimaryButton variant="primary" onClick={handleGoPattern}>
          내 패턴 보러가기
        </PrimaryButton>
        <S.SkipButton type="button" onClick={handleGoHome}>
          홈으로 가기
        </S.SkipButton>
      </S.BottomArea>
    </S.PageContainer>
  );
}

export default CompletePage;
