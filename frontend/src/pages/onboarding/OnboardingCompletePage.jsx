import { useNavigate } from "react-router-dom";
import mascotRunImg from "../../assets/mascot-run.svg";
import * as S from "./OnboardingCompletePage.styles";

const OnboardingCompletePage = () => {
  const navigate = useNavigate();
  const nextMe = "러닝할 때 숨이 차서 먼저 멈추지 않는 나";
  const motivation = "건강을 위해서";
  const leftMessage = "러닝도 수영도, 체력 때문에 포기하고 싶지 않아";

  const handleStart = () => {
    navigate("/onboarding/device");
  };

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
            <S.NextMeText>{nextMe}</S.NextMeText>

            <S.NextMeSubLabel>내가 남긴 말</S.NextMeSubLabel>
            <S.NextMeSubText>{leftMessage}</S.NextMeSubText>

            <S.MascotImage src={mascotRunImg} alt="" />
          </S.NextMeCard>

          <S.SectionTitle>NEXT ME가 기억해둘 것들</S.SectionTitle>

          <S.MemoryItem>
            <S.MemoryLabel>원하는 미래</S.MemoryLabel>
            <S.MemoryText>{nextMe}</S.MemoryText>
          </S.MemoryItem>

          <S.MemoryItem>
            <S.MemoryLabel>시작한 이유</S.MemoryLabel>
            <S.MemoryText>{motivation}</S.MemoryText>
          </S.MemoryItem>

          <S.MemoryItem>
            <S.MemoryLabel>내가 남긴 말</S.MemoryLabel>
            <S.MemoryText>"{leftMessage}"</S.MemoryText>
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
