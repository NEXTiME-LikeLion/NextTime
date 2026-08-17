import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useElementHeight } from "../../hooks/useElementHeight";
import { useNextTime } from "../../contexts/NextTimeContext";

import { RECORD_OPTIONS, RECORD_NOTE } from "../../data/nextTimeRecord";
import Header from "../../components/next-time/Header";
import OptionGrid from "../../components/next-time/OptionGrid";
import TextAreaField from "../../components/next-time/TextAreaField";
import PrimaryButton from "../../components/next-time/PrimaryButton";

const RECORD_FIELD_LAYOUT = {
  howDidYouDo: "list-start",
  currentIntensity: "grid-2",
  missionFeedback: "grid-3",
};

function RecordPage() {
  const navigate = useNavigate();
  const {
    situationIntensity,
    location,
    moment,
    recommendedMission,
    recordAnswers,
    setRecordAnswers,
    updateRecordAnswer,
    resetFlow,
  } = useNextTime();
  const { howDidYouDo, currentIntensity, missionFeedback, additionalNote } =
    recordAnswers;

  const isFormValid = howDidYouDo && currentIntensity && missionFeedback;

  const [bottomAreaRef, bottomAreaHeight] = useElementHeight();

  const handleSubmit = () => {
    if (!isFormValid) return;

    const fullRecord = {
      howDidYouDo,
      currentIntensity,
      missionFeedback,
      additionalNote,
      situationIntensity,
      location,
      moment,
      recommendedMissionId: recommendedMission.id,
      recommendedMissionTitle: recommendedMission.title,
    };

    setRecordAnswers(fullRecord);

    // TODO: 기록 저장 API 연동 시
    // await saveRecord({ ...fullRecord, missionId: recommendedMission.id });

    resetFlow(); // Next Time 초기화
    navigate("/next-time/complete", { replace: true });
  };

  return (
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
          />
        </FieldGroup>
      </ScrollContent>

      <BottomArea ref={bottomAreaRef}>
        <PrimaryButton disabled={!isFormValid} onClick={handleSubmit}>
          기록하기
        </PrimaryButton>
      </BottomArea>
    </PageContainer>
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
