import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useNextTime } from "../../contexts/NextTimeContext";
import { CONTEXT_STEPS } from "../../data/nextTimeMock";
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

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      return;
    }
    navigate(-1);
  };

  const handleSelect = (value) => {
    fieldConfig.setter(nextTime)(value);
  };

  const handlePrimaryAction = () => {
    if (!selectedValue) return;

    if (isLastStep) {
      navigate("/next-time/next-me");
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  return (
    <PageContainer>
      <Header title="NEXT TIME" onBack={handleBack} />

      <IntroBlock>
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

      <ScrollContent>
        <Question>{currentStep.question}</Question>
        <OptionGrid
          options={currentStep.options}
          variant={currentStep.variant}
          layout={currentStep.layout}
          selectedValue={selectedValue}
          onChange={handleSelect}
        />
      </ScrollContent>

      <BottomArea>
        <PrimaryButton
          disabled={!selectedValue}
          variant="ghost"
          onClick={handlePrimaryAction}
        >
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
`;

const IntroBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 1.25rem;
  margin-bottom: 1.25rem;
`;

const MainTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

const HelperText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
`;

const ProgressBarWrap = styled.div`
  padding: 0 1.25rem;
  margin-bottom: 1.75rem;
`;

const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 1rem;
`;

const Question = styled.h2`
  padding: 0 1.25rem;
  margin-bottom: 1.25rem;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

const BottomArea = styled.div`
  flex-shrink: 0;
  padding: 0 1.25rem 2.25rem;
`;
