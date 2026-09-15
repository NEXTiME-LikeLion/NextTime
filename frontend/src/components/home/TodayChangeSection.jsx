import { useNavigate } from "react-router-dom";
import ProgressIndicator from "./ProgressIndicator";
import rightArrow from "../../assets/right-arrow.svg";
import * as S from "./TodayChangeSection.styles";

function TodayChangeSection({ todaySummary }) {
  const navigate = useNavigate();

  const {
    totalAttemptCount = 0,
    overcomeCount = 0,
    delayedCount = 0,
    smokedCount = 0,
    nextAction,
  } = todaySummary ?? {};

  if (totalAttemptCount === 0) {
    return null;
  }

  const dots = [
    ...Array(overcomeCount).fill("overcome"),
    ...Array(delayedCount).fill("postpone"),
    ...Array(smokedCount).fill("smoke"),
  ];

  return (
    <S.Section>
      <S.SectionTitle>오늘의 변화</S.SectionTitle>

      <S.Card
        onClick={() => navigate("/main/pattern")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/main/pattern");
          }
        }}
      >
        <S.TopRow>
          <S.StatBlock>
            <S.StatCount>
              <S.Strong>{overcomeCount}</S.Strong>
              <S.Muted> / {totalAttemptCount}</S.Muted>
            </S.StatCount>
            <S.StatLabel>기록한 욕구를 넘겼어요</S.StatLabel>
          </S.StatBlock>
          <S.Chevron src={rightArrow} alt="" aria-hidden="true" />
        </S.TopRow>

        <S.MiddleRow>
          <ProgressIndicator dots={dots} />
          <S.Summary>
            넘김 {overcomeCount} · 미룸 {delayedCount} · 흡연 {smokedCount}
          </S.Summary>
        </S.MiddleRow>

        {nextAction && (
          <>
            <S.Divider />

            <S.NextActionBlock>
              <S.NextActionLabel>다음해도 해볼 행동</S.NextActionLabel>
              <S.NextActionTitle>{nextAction.name}</S.NextActionTitle>
              <S.NextActionDesc>{nextAction.reason}</S.NextActionDesc>
            </S.NextActionBlock>
          </>
        )}
      </S.Card>
    </S.Section>
  );
}

export default TodayChangeSection;
