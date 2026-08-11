import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mascotSvg from "../../assets/mascot.svg";
import logoSvg from "../../assets/logo.svg";
import * as S from "./Splash.styles";

const SPLASH_DURATION = 2000;

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <S.Container>
      <S.MascotWrapper>
        <S.MascotImage src={mascotSvg} alt="마스코트" />
      </S.MascotWrapper>
      <S.LogoImage src={logoSvg} alt="NEXTIME" />
    </S.Container>
  );
}

export default Splash;
