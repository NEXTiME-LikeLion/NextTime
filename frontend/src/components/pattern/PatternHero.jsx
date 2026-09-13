import * as S from "./PatternHero.styles";
import mascot from "../../assets/mascot.webp";
import { REQUIRED_PATTERN_RECORDS } from "./patternReport";

function PatternHero({
  isPreparing = false,
  recordCount = 0,
  weeklyLabel = "1.4개비 ↓",
}) {
  const ratio = recordCount / REQUIRED_PATTERN_RECORDS;

  return (
    <S.Hero>
      <S.TitleRow>
        <S.Title>내 패턴</S.Title>
      </S.TitleRow>
      <S.Mascot src={mascot} alt="" width={86} height={158} />
      {isPreparing ? (
        <S.PreparingCard>
          <S.PreparingMessage>
            기록이 5번 이상 누적되면
            <br />
            패턴을 알려드릴 수 있어요!
          </S.PreparingMessage>
          <S.ProgressBlock>
            <S.ProgressBar>
              <S.ProgressFill $ratio={ratio} />
            </S.ProgressBar>
            <S.ProgressText>
              현재 기록 {recordCount} / {REQUIRED_PATTERN_RECORDS}
            </S.ProgressText>
          </S.ProgressBlock>
        </S.PreparingCard>
      ) : (
        <S.WeeklyMetric>
          <S.WeeklyLabel>이번 주 감연</S.WeeklyLabel>
          <S.WeeklyValue>{weeklyLabel}</S.WeeklyValue>
        </S.WeeklyMetric>
      )}
    </S.Hero>
  );
}

export default PatternHero;
