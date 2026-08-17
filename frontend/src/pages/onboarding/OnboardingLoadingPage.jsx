import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mascotImg from "../../assets/mascot-loading.svg";
import { saveOnboarding } from "../../api/saveOnboarding";
import { generateNextMe } from "../../api/generateNextMe";
import { saveCopingProfile } from "../../api/saveCopingProfile";
import * as S from "./OnboardingLoadingPage.styles";

const OnboardingLoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers, customInputs } = location.state || {};

  useEffect(() => {
    if (!answers) {
      navigate("/onboarding");
      return;
    }

    const runOnboarding = async () => {
      try {
        await saveOnboarding(answers);
        const nextMeData = await generateNextMe(answers, customInputs);
        await saveCopingProfile(answers, customInputs);

        navigate("/onboarding/complete", { state: { nextMeData } });
      } catch (error) {
        console.error("온보딩 저장 실패:", error);
        // TODO: 에러 화면 처리 필요
      }
    };

    runOnboarding();
  }, [answers, customInputs, navigate]);

  return (
    <S.Wrapper>
      <S.Content>
        <S.MascotWrapper>
          <S.MascotImage src={mascotImg} alt="" />
        </S.MascotWrapper>
        <S.Title>NEXT ME를 만들고 있어요</S.Title>
        <S.Description>
          당신이 남긴 이야기를 바탕으로
          <br />
          앞으로 떠올리고 싶은 모습을 만들고 있어요.
          <br />
          담배 생각이 날 때면 상황에 맞는
          <br />
          '미래의 목소리'로 다시 찾아와요.
        </S.Description>
      </S.Content>
      <S.Footer>
        <S.ProgressBarTrack>
          <S.ProgressBarFill />
        </S.ProgressBarTrack>
        <S.FooterText>AI가 당신의 맞춤형 미래를 생성 중이에요...</S.FooterText>
      </S.Footer>
    </S.Wrapper>
  );
};

export default OnboardingLoadingPage;
