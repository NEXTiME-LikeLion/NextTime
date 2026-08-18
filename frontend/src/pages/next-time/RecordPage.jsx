import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useElementHeight } from "../../hooks/useElementHeight";
import { useNextTime } from "../../contexts/NextTimeContext";
import useAsync from "../../hooks/useAsync";
import useNextTimeStatusRedirect from "../../hooks/useNextTimeStatusRedirect";
import {
  buildNextTimeResultBody,
  getNextTimePathByStatus,
  isNextTimeStatusAfter,
  saveNextTimeResult,
} from "../../api/nextTime";

import {
  FEEDBACK_MAX_LENGTH,
  RECORD_OPTIONS,
  RECORD_NOTE,
} from "../../data/nextTimeRecord";
import Header from "../../components/next-time/Header";
import OptionGrid from "../../components/next-time/OptionGrid";
import TextAreaField from "../../components/next-time/TextAreaField";
import PrimaryButton from "../../components/next-time/PrimaryButton";
import ApiStatusView from "../../components/common/ApiStatusView";

const RECORD_FIELD_LAYOUT = {
  howDidYouDo: "list-start",
  currentIntensity: "grid-2",
  missionFeedback: "grid-3",
};

const logSavedResult = (result) => {
  console.log("결과를 저장했습니다.", {
    sessionId: result.sessionId,
    status: result.status,
    result: result.result,
    cravingBefore: result.cravingBefore,
    cravingAfter: result.cravingAfter,
    cravingChange: result.cravingChange,
    missionHelpfulness: result.missionHelpfulness,
    feedback: result.feedback,
    memorySummary: result.memorySummary,
    memorySource: result.memorySource,
    resultRecordedAt: result.resultRecordedAt,
    data: result,
  });
};

function RecordPage() {
  const navigate = useNavigate();
  const {
    session,
    sessionId,
    recordAnswers,
    setSession,
    updateRecordAnswer,
  } = useNextTime();
  useNextTimeStatusRedirect("MISSION_COMPLETED");
  const { howDidYouDo, currentIntensity, missionFeedback, additionalNote } =
    recordAnswers;
  const { isLoading, error, execute, refetch } = useAsync(saveNextTimeResult, {
    immediate: false,
  });

  const isFormValid = howDidYouDo && currentIntensity && missionFeedback;

  const [bottomAreaRef, bottomAreaHeight] = useElementHeight();

  const goToComplete = (savedResult) => {
    if (savedResult) {
      setSession((prev) => ({ ...(prev ?? {}), ...savedResult }));
    }
    navigate("/next-time/complete", { replace: true });
  };

  const saveResult = async () => {
    if (!isFormValid || isLoading) return;

    const payload = buildNextTimeResultBody({
      howDidYouDo,
      currentIntensity,
      missionFeedback,
      additionalNote,
    });

    if (!sessionId) {
      console.error("세션 ID가 없어 결과를 저장할 수 없습니다.");
      return;
    }

    if (!payload.result || !payload.cravingAfter || !payload.missionHelpfulness) {
      console.error("기록 데이터 매핑에 실패했습니다.", {
        howDidYouDo,
        currentIntensity,
        missionFeedback,
        payload,
      });
      return;
    }

    if (isNextTimeStatusAfter(session?.status, "MISSION_COMPLETED")) {
      const path = getNextTimePathByStatus(session.status);
      console.log("세션이 이미 결과 기록 이후 단계라 저장을 건너뜁니다.", {
        sessionId,
        status: session.status,
        path,
        session,
      });
      if (session.status === "RESULT_RECORDED") {
        goToComplete(session);
        return;
      }
      navigate(path, { replace: true });
      return;
    }

    console.log("결과를 저장합니다.", { sessionId, payload });
    const result = await execute(sessionId, payload);
    if (!result) {
      console.error("결과 저장에 실패했습니다.");
      return;
    }

    logSavedResult(result);
    goToComplete(result);
  };

  const handleRetry = async () => {
    console.log("결과 저장을 다시 시도합니다.", { sessionId });
    const result = await refetch();
    if (!result) {
      console.error("결과 저장에 실패했습니다.");
      return;
    }

    logSavedResult(result);
    goToComplete(result);
  };

  return (
    <ApiStatusView
      variant="dark"
      isLoading={isLoading}
      error={error}
      onRetry={handleRetry}
      loadingTitle="기록을 저장하는 중이에요"
      errorTitle="기록 저장에 실패했어요"
    >
    <PageContainer>
      <Header title="기록하기" back={false} />

      <IntroBlock>
        <MainTitle>지금은 어떠신가요?</MainTitle>
        <HelperText>
          방금의 변화를 다음 추천에 반영하고 패턴을 찾아드릴게요
        </HelperText>
      </IntroBlock>

      <ScrollContent $bottomAreaHeight={bottomAreaHeight}>
        <FieldGroup>
          <FieldLabel>{RECORD_OPTIONS.howDidYouDo.label}</FieldLabel>
          <OptionGrid
            options={RECORD_OPTIONS.howDidYouDo.options}
            variant="chip"
            layout={RECORD_FIELD_LAYOUT.howDidYouDo}
            selectedValue={howDidYouDo}
            onChange={(value) => updateRecordAnswer("howDidYouDo", value)}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>{RECORD_OPTIONS.currentIntensity.label}</FieldLabel>
          <OptionGrid
            options={RECORD_OPTIONS.currentIntensity.options}
            variant="chip"
            layout={RECORD_FIELD_LAYOUT.currentIntensity}
            selectedValue={currentIntensity}
            onChange={(value) => updateRecordAnswer("currentIntensity", value)}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>{RECORD_OPTIONS.missionFeedback.label}</FieldLabel>
          <OptionGrid
            options={RECORD_OPTIONS.missionFeedback.options}
            variant="chip"
            layout={RECORD_FIELD_LAYOUT.missionFeedback}
            selectedValue={missionFeedback}
            onChange={(value) => updateRecordAnswer("missionFeedback", value)}
            gap={"0.46rem"}
          />
        </FieldGroup>

        <FieldGroup>
          <OptionalLabelBlock>
            <FieldLabel>
              {RECORD_NOTE.optionalLabel}
              <OptionalTag> (선택 사항)</OptionalTag>
            </FieldLabel>
            <OptionalHint>{RECORD_NOTE.optionalHint}</OptionalHint>
          </OptionalLabelBlock>
          <TextAreaField
            value={additionalNote}
            onChange={(e) =>
              updateRecordAnswer("additionalNote", e.target.value)
            }
            placeholder={RECORD_NOTE.placeholder}
            maxLength={FEEDBACK_MAX_LENGTH}
          />
        </FieldGroup>
      </ScrollContent>

      <BottomArea ref={bottomAreaRef}>
        <PrimaryButton disabled={!isFormValid || isLoading} onClick={saveResult}>
          기록하기
        </PrimaryButton>
      </BottomArea>
    </PageContainer>
    </ApiStatusView>
  );
}

export default RecordPage;

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
  align-items: flex-start;
  gap: 0.25rem;
  margin-top: 1.13rem;
  line-height: 1.4;
  word-break: keep-all;
`;

const MainTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.25rem;
  font-weight: 600;
`;

const HelperText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 400;
`;

const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  margin-top: 1.56rem;
  padding-bottom: ${({ $bottomAreaHeight }) => $bottomAreaHeight}rem;
`;

const FieldGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FieldLabel = styled.h2`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

const OptionalLabelBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OptionalTag = styled.span`
  color: ${({ theme }) => theme.colors.gray};
`;

const OptionalHint = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

const BottomArea = styled.div`
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  bottom: 0;
  padding-block: 3.56rem 2.25rem;

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
