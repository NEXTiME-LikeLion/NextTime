import { useLocation, useNavigate } from "react-router-dom";
import mascotRunImg from "../../assets/mascot-run.webp";
import * as S from "./OnboardingCompletePage.styles";

const OnboardingCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nextMeData, answers } = location.state || {};

  const handleStart = () => {
    navigate("/onboarding/device");
  };

  if (!nextMeData || !answers) {
    navigate("/onboarding");
    return null;
  }

  return (
    <>
      <S.Wrapper>
        <S.Content>
          <S.Title>당신의 NEXT ME가 만들어졌어요</S.Title>
          <S.Description>
            쌓인 기록은 다음 NEXT TIME 추천과
            <br />
            NEXT ME의 목소리에 반영돼요.
          </S.Description>

          <S.NextMeCard>
            <S.NextMeLabel>NEXT ME</S.NextMeLabel>
            <S.NextMeText>{nextMeData.headline}</S.NextMeText>

            <S.NextMeSubLabel>내가 남긴 말</S.NextMeSubLabel>
            <S.NextMeSubText>{answers.leftMessage}</S.NextMeSubText>

            <S.MascotImage src={mascotRunImg} alt="" />
          </S.NextMeCard>

          <S.SectionTitle>NEXT ME가 기억해둘 것들</S.SectionTitle>

          <S.MemoryItem>
            <S.MemoryLabel>원하는 미래</S.MemoryLabel>
            <S.MemoryText>{answers.nextMe}</S.MemoryText>
          </S.MemoryItem>

          <S.MemoryItem>
            <S.MemoryLabel>시작한 이유</S.MemoryLabel>
            <S.MemoryText>{answers.motivation}</S.MemoryText>
          </S.MemoryItem>

          <S.MemoryItem>
            <S.MemoryLabel>내가 남긴 말</S.MemoryLabel>
            <S.MemoryText>"{answers.leftMessage}"</S.MemoryText>
          </S.MemoryItem>

          <S.StartButton onClick={handleStart}>
            이 모습으로 시작하기
          </S.StartButton>
        </S.Content>
      </S.Wrapper>
    </>
  );
};

export default OnboardingCompletePage;
