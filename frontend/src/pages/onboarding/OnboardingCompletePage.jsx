import { useLocation, useNavigate } from "react-router-dom";
import mascotRunImg from "../../assets/mascot-run.svg";
import * as S from "./OnboardingCompletePage.styles";

const OnboardingCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { nextMeData } = location.state || {};

  const handleStart = () => {
    navigate("/onboarding/device");
  };

  if (!nextMeData) {
    // 데이터 없이 직접 접근한 경우, 온보딩 처음으로 되돌림
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

            <S.NextMeSubLabel>시작한 이유</S.NextMeSubLabel>
            <S.NextMeSubText>{nextMeData.start_reason}</S.NextMeSubText>

            <S.MascotImage src={mascotRunImg} alt="" />
          </S.NextMeCard>

          <S.StartButton onClick={handleStart}>
            이 모습으로 시작하기
          </S.StartButton>
          <S.EditLink>NEXT ME 수정하기</S.EditLink>
        </S.Content>
      </S.Wrapper>
    </>
  );
};

export default OnboardingCompletePage;
