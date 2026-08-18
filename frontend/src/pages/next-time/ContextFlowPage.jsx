import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useElementHeight } from "../../hooks/useElementHeight";
import { useNextTime } from "../../contexts/NextTimeContext";
import { CONTEXT_STEPS } from "../../data/nextTimeSteps";
import Header from "../../components/next-time/Header";
import ProgressBar from "../../components/next-time/ProgressBar";
import OptionGrid from "../../components/next-time/OptionGrid";
import PrimaryButton from "../../components/next-time/PrimaryButton";

const STEP_FIELD_MAP = {
  intensity: {
    getter: (ctx) => ctx.situationIntensity,
    setter: (ctx) => ctx.setSituationIntensity,
  },
  location: {
    getter: (ctx) => ctx.location,
    setter: (ctx) => ctx.setLocation,
  },
  moment: {
    getter: (ctx) => ctx.moment,
    setter: (ctx) => ctx.setMoment,
  },
};

function ContextFlowPage() {
  const navigate = useNavigate();
  const nextTime = useNextTime();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = CONTEXT_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === CONTEXT_STEPS.length - 1;
  const fieldConfig = STEP_FIELD_MAP[currentStep.id];
  const selectedValue = fieldConfig.getter(nextTime);
  const progressPercentage =
    ((currentStepIndex + 1) / CONTEXT_STEPS.length) * 100;

  const [bottomAreaRef, bottomAreaHeight] = useElementHeight();

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      return;
    }
    navigate("/main", { replace: true });
  };

  const handleSelect = (value) => {
    fieldConfig.setter(nextTime)(value);
  };

  const handlePrimaryAction = () => {
    if (!selectedValue) return;

    if (isLastStep) {
      navigate("/next-time/next-me", { replace: true });
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  return (
    <PageContainer>
      <Header onBack={handleBack} />

      <IntroBlock>
        <NextTime>NEXT TIME</NextTime>
        <MainTitle>
          현재 상황을
          <br />
          간단하게 알려주세요.
        </MainTitle>
        <HelperText>욕구를 줄이도록 도움을 드리기 위해 필요해요</HelperText>
      </IntroBlock>

      <ProgressBarWrap>
        <ProgressBar percentage={progressPercentage} />
      </ProgressBarWrap>

      <ScrollContent $bottomAreaHeight={bottomAreaHeight}>
        <Question>{currentStep.question}</Question>
        <OptionGrid
          options={currentStep.options}
          variant={currentStep.variant}
          layout={currentStep.layout}
          selectedValue={selectedValue}
          onChange={handleSelect}
        />
      </ScrollContent>

      <BottomArea ref={bottomAreaRef}>
        <PrimaryButton disabled={!selectedValue} onClick={handlePrimaryAction}>
          {isLastStep ? "내게 맞는 행동 찾기" : "다음"}
        </PrimaryButton>
      </BottomArea>
    </PageContainer>
  );
}

export default ContextFlowPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding-inline: 1.25rem;
  position: relative;
`;

const IntroBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 2rem;

  font-weight: 700;
  line-height: 1.4;
`;

const NextTime = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
`;

const MainTitle = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
`;

const HelperText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 400;
`;

const ProgressBarWrap = styled.div`
  margin-bottom: 1.5rem;
`;

const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: ${({ $bottomAreaHeight }) => $bottomAreaHeight}rem;
`;

const Question = styled.h2`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

const BottomArea = styled.div`
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  bottom: 0;
  padding-block: 2.5rem 2.25rem;

  background: linear-gradient(
    to bottom,
    rgba(10, 10, 20, 0) 0%,
    rgba(10, 10, 20, 0.85) 35%,
    rgba(10, 10, 20, 0.85) 100%
  );

  pointer-events: none;

  & > button {
    opacity: 0.92;
    pointer-events: auto;
  }
`;
