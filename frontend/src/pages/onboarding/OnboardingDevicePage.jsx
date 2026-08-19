import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deviceIconImg from "../../assets/device.svg";
import mascotLoading from "../../assets/mascot-loading.svg";
import * as S from "./OnboardingDevicePage.styles";

const SEARCH_DURATION_MS = 4000;

const OnboardingDevicePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("idle");

  useEffect(() => {
    if (step !== "searching") return undefined;

    const timer = setTimeout(() => {
      setStep("notFound");
    }, SEARCH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [step]);

  const handleConnect = () => {
    setStep("searching");
  };

  const handleSkip = () => {
    navigate("/main");
  };

  const handleGoHome = () => {
    navigate("/main");
  };

  if (step === "searching") {
    return (
      <S.StatusScreen>
        <S.StatusContent>
          <S.StatusMascot src={mascotLoading} alt="" />
          <S.StatusTitle>기기를 찾고 있습니다.</S.StatusTitle>
        </S.StatusContent>
      </S.StatusScreen>
    );
  }

  if (step === "notFound") {
    return (
      <S.StatusScreen>
        <S.StatusContent>
          <S.StatusTitle>화면에 연결할 기기가 없습니다.</S.StatusTitle>
          <S.HomeButton type="button" onClick={handleGoHome}>
            홈화면으로 이동
          </S.HomeButton>
        </S.StatusContent>
      </S.StatusScreen>
    );
  }

  return (
    <S.Wrapper>
      <S.Content>
        <S.DeviceIcon src={deviceIconImg} alt="" />

        <S.Title>NEXT ME 기기가 있으신가요?</S.Title>
        <S.Description>
          NEXTiME 기기를 연결하면 흡연 순간을 빠르게 기록하고,
          <br />
          흡연 욕구를 줄이는 데에 도움을 받을 수 있어요
        </S.Description>

        <S.SubDescription>
          기기가 없어도 NEXTiME의 모든 앱 기능을
          <br />
          이용할 수 있어요
        </S.SubDescription>

        <S.ConnectButton onClick={handleConnect}>기기 연결하기</S.ConnectButton>
        <S.SkipText onClick={handleSkip}>건너뛰기</S.SkipText>
      </S.Content>
    </S.Wrapper>
  );
};

export default OnboardingDevicePage;
