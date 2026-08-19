import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useElementHeight } from "../../hooks/useElementHeight";
import { useNextTime } from "../../contexts/NextTimeContext";
import useAsync from "../../hooks/useAsync";
import useNextTimeStatusRedirect from "../../hooks/useNextTimeStatusRedirect";
import { CONTEXT_STEPS } from "../../data/nextTimeSteps";
import {
  buildNextTimeContextBody,
  getNextTimePathByStatus,
  saveNextTimeContext,
} from "../../api/nextTime";
import Header from "../../components/next-time/Header";
import ProgressBar from "../../components/next-time/ProgressBar";
import OptionGrid from "../../components/next-time/OptionGrid";
import PrimaryButton from "../../components/next-time/PrimaryButton";
import ApiStatusView from "../../components/common/ApiStatusView";

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
  const { session, sessionId, setSession } = nextTime;
  useNextTimeStatusRedirect("CREATED");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { isLoading, error, execute, refetch } = useAsync(saveNextTimeContext, {
    immediate: false,
  });

  const currentStep = CONTEXT_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === CONTEXT_STEPS.length - 1;
  const fieldConfig = STEP_FIELD_MAP[currentStep.id];
  const selectedValue = fieldConfig.getter(nextTime);
  const progressPercentage =
    ((currentStepIndex + 1) / CONTEXT_STEPS.length) * 100;

  const [bottomAreaRef, bottomAreaHeight] = useElementHeight();

  const goToNextMe = (savedSession) => {
    if (savedSession) {
      setSession((prev) => ({ ...(prev ?? {}), ...savedSession }));
    }
    navigate("/next-time/next-me", { replace: true });
  };

  const saveContext = async () => {
    const payload = buildNextTimeContextBody({
      situationIntensity: nextTime.situationIntensity,
      location: nextTime.location,
      moment: nextTime.moment,
    });

    if (!sessionId) {
      console.error("세션 ID가 없어 상황을 저장할 수 없습니다.");
      return;
    }

    if (
      !payload.cravingBefore ||
      !payload.locationContextId ||
      !payload.triggerContextId
    ) {
      console.error("상황 데이터 매핑에 실패했습니다.", {
        situationIntensity: nextTime.situationIntensity,
        location: nextTime.location,
        moment: nextTime.moment,
        payload,
      });
      return;
    }

    if (session?.status && session.status !== "CREATED") {
      const path = getNextTimePathByStatus(session.status);
      console.log("세션이 CREATED 상태가 아니라 상황 저장을 건너뜁니다.", {
        sessionId,
        status: session.status,
        path,
        session,
      });
      navigate(path, { replace: true });
      return;
    }

    console.log("상황 데이터를 저장합니다.", { sessionId, payload });
    const result = await execute(sessionId, payload);
    if (!result) {
      console.error("상황 데이터 저장에 실패했습니다.");
      return;
    }

    console.log("상황 데이터를 저장했습니다.", result);
    goToNextMe(result);
  };

  const handleRetry = async () => {
    console.log("상황 데이터 저장을 다시 시도합니다.");
    const result = await refetch();
    if (!result) {
      console.error("상황 데이터 저장에 실패했습니다.");
      return;
    }

    console.log("상황 데이터를 저장했습니다.", result);
    goToNextMe(result);
  };

  const handleBack = () => {
    if (isLoading) return;

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
    if (!selectedValue || isLoading) return;

    if (isLastStep) {
      saveContext();
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  return (
    <ApiStatusView
      variant="dark"
      isLoading={isLoading}
      error={error}
      onRetry={handleRetry}
      loadingTitle="상황을 저장하는 중이에요"
      errorTitle="상황 저장에 실패했어요"
    >
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
    </ApiStatusView>
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
