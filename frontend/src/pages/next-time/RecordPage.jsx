import * as S from "./RecordPage.styles";
import { useNavigate } from "react-router-dom";
import { useNextTime } from "../../contexts/NextTimeContext";
import useAsync from "../../hooks/useAsync";
import useNextTimeStatusRedirect from "../../hooks/useNextTimeStatusRedirect";
import {
  buildNextTimeResultBody,
  getNextTimePathByStatus,
  isNextTimeRecordableStatus,
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
import { debugLog, debugError } from "../../api/debugLog";

const RECORD_FIELD_LAYOUT = {
  howDidYouDo: "list-start",
  currentIntensity: "grid-2",
  missionFeedback: "grid-3",
};

const logSavedResult = (result) => {
  debugLog("nextTime", "결과를 저장했습니다.", {
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
  const { session, sessionId, recordAnswers, setSession, updateRecordAnswer } =
    useNextTime();
  useNextTimeStatusRedirect("MISSION_COMPLETED");
  const { howDidYouDo, currentIntensity, missionFeedback, additionalNote } =
    recordAnswers;
  const { isLoading, error, execute, refetch } = useAsync(saveNextTimeResult, {
    immediate: false,
  });

  const isFormValid = howDidYouDo && currentIntensity && missionFeedback;

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
      debugError("nextTime", "세션 ID가 없어 결과를 저장할 수 없습니다.");
      return;
    }

    if (
      !payload.result ||
      !payload.cravingAfter ||
      !payload.missionHelpfulness
    ) {
      debugError("nextTime", "기록 데이터 매핑에 실패했습니다.", null, {
        howDidYouDo,
        currentIntensity,
        missionFeedback,
        payload,
      });
      return;
    }

    if (
      !isNextTimeRecordableStatus(session?.status) &&
      isNextTimeStatusAfter(session?.status, "MISSION_COMPLETED")
    ) {
      const path = getNextTimePathByStatus(session.status);
      debugLog(
        "nextTime",
        "세션이 이미 결과 기록 이후 단계라 저장을 건너뜁니다.",
        {
          sessionId,
          status: session.status,
          path,
          session,
        },
      );
      if (session.status === "RESULT_RECORDED") {
        goToComplete(session);
        return;
      }
      navigate(path, { replace: true });
      return;
    }

    debugLog("nextTime", "결과를 저장합니다.", { sessionId, payload });
    const result = await execute(sessionId, payload);
    if (!result) {
      debugError("nextTime", "결과 저장에 실패했습니다.", error);
      return;
    }

    logSavedResult(result);
    goToComplete(result);
  };

  const handleRetry = async () => {
    debugLog("nextTime", "결과 저장을 다시 시도합니다.", { sessionId });
    const result = await refetch();
    if (!result) {
      debugError("nextTime", "결과 저장에 실패했습니다.", error);
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
      errorTitle="기록 저장에 실패했어요"
    >
      <S.PageContainer>
        <Header title="기록하기" back={false} />

        <S.IntroBlock>
          <S.MainTitle>지금은 어떠신가요?</S.MainTitle>
          <S.HelperText>
            방금의 변화를 다음 추천에 반영하고 패턴을 찾아드릴게요
          </S.HelperText>
        </S.IntroBlock>

        <S.ScrollContent>
          <S.FieldGroup>
            <S.FieldLabel>{RECORD_OPTIONS.howDidYouDo.label}</S.FieldLabel>
            <OptionGrid
              options={RECORD_OPTIONS.howDidYouDo.options}
              variant="chip"
              layout={RECORD_FIELD_LAYOUT.howDidYouDo}
              selectedValue={howDidYouDo}
              onChange={(value) => updateRecordAnswer("howDidYouDo", value)}
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.FieldLabel>{RECORD_OPTIONS.currentIntensity.label}</S.FieldLabel>
            <OptionGrid
              options={RECORD_OPTIONS.currentIntensity.options}
              variant="chip"
              layout={RECORD_FIELD_LAYOUT.currentIntensity}
              selectedValue={currentIntensity}
              onChange={(value) =>
                updateRecordAnswer("currentIntensity", value)
              }
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.FieldLabel>{RECORD_OPTIONS.missionFeedback.label}</S.FieldLabel>
            <OptionGrid
              options={RECORD_OPTIONS.missionFeedback.options}
              variant="chip"
              layout={RECORD_FIELD_LAYOUT.missionFeedback}
              selectedValue={missionFeedback}
              onChange={(value) => updateRecordAnswer("missionFeedback", value)}
              gap={"0.46rem"}
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.OptionalLabelBlock>
              <S.FieldLabel>
                {RECORD_NOTE.optionalLabel}
                <S.OptionalTag> (선택 사항)</S.OptionalTag>
              </S.FieldLabel>
              <S.OptionalHint>{RECORD_NOTE.optionalHint}</S.OptionalHint>
            </S.OptionalLabelBlock>
            <TextAreaField
              value={additionalNote}
              onChange={(e) =>
                updateRecordAnswer("additionalNote", e.target.value)
              }
              placeholder={RECORD_NOTE.placeholder}
              maxLength={FEEDBACK_MAX_LENGTH}
            />
          </S.FieldGroup>
          <S.BottomArea>
            <PrimaryButton
              disabled={!isFormValid || isLoading}
              onClick={saveResult}
            >
              기록하기
            </PrimaryButton>
          </S.BottomArea>
        </S.ScrollContent>
      </S.PageContainer>
    </ApiStatusView>
  );
}

export default RecordPage;
