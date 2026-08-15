import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mascotImg from "../../assets/mascot-loading.svg";
import statusBarImg from "../../assets/statusbar.svg";
import * as S from "./OnboardingLoadingPage.styles";

const LOADING_DURATION = 3000;

const OnboardingLoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, LOADING_DURATION);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <S.Wrapper>
      <S.StatusBarImage src={statusBarImg} alt="" />

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
