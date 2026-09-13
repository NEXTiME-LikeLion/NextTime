import BottomSheet from "../common/BottomSheet";
import changeTrend from "../../assets/pattern/change-trend.svg";
import { getReductionChange } from "./patternReport";
import * as S from "./ReductionChangeSheet.styles";

const MAX_BAR_HEIGHT = 76.667;
const EMPTY_BAR_HEIGHT = 8;

function formatCigarettes(value) {
  if (value == null) return "-";
  return `${formatChartValue(value)}개비`;
}

function formatChartValue(value) {
  if (value == null) return "";
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function ReductionChangeSheet({ isOpen, onClose, report }) {
  const data = getReductionChange(report);
  const recordedAmounts = data.daily
    .map((item) => item.amount)
    .filter((amount) => amount != null);
  const scaleMax = Math.max(data.lastWeekAverage ?? 0, ...recordedAmounts, 0);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <S.Section>
        <S.Header>
          <S.Title>흡연량 변화</S.Title>
          <S.Subtitle>
            지난주 대비 이번주 흡연량이 어떻게 변했는지 확인해요
          </S.Subtitle>
        </S.Header>
        <S.CompareRow>
          <S.WeekCard $tone="muted" $empty={!data.hasLastWeek}>
            <S.WeekCardLabel>지난주 하루 평균</S.WeekCardLabel>
            {data.hasLastWeek ? (
              <S.WeekCardValue>
                {formatCigarettes(data.lastWeekAverage)}
              </S.WeekCardValue>
            ) : (
              <S.WeekCardEmpty>
                기록이 쌓이면 지난주와
                <br />
                비교가 가능해져요!
              </S.WeekCardEmpty>
            )}
          </S.WeekCard>
          <S.Trend>
            <S.TrendIcon
              src={changeTrend}
              alt=""
              width={24}
              height={24}
              aria-hidden
            />
            <S.TrendLabel>{data.changeLabel}</S.TrendLabel>
          </S.Trend>
          <S.WeekCard $tone="current">
            <S.WeekCardLabel>이번 주 하루 평균</S.WeekCardLabel>
            <S.WeekCardValue>
              {formatCigarettes(data.thisWeekAverage)}
            </S.WeekCardValue>
          </S.WeekCard>
        </S.CompareRow>
      </S.Section>

      <S.Section>
        <S.ChartTitle>이번 주 하루 흡연량</S.ChartTitle>
        <S.Chart>
          {data.hasLastWeek ? (
            <S.AverageLabel>
              지난주 평균 {formatChartValue(data.lastWeekAverage)}
            </S.AverageLabel>
          ) : null}
          <S.Plot>
            {data.hasLastWeek && scaleMax > 0 ? (
              <S.AverageLine
                $offset={`${(data.lastWeekAverage / scaleMax) * (MAX_BAR_HEIGHT / 16)}rem`}
              />
            ) : null}
            {data.daily.map((item) => {
              const empty = item.amount == null;
              const highlight = item.day === data.highlightDay;
              const height = empty
                ? EMPTY_BAR_HEIGHT
                : scaleMax > 0
                  ? (item.amount / scaleMax) * MAX_BAR_HEIGHT
                  : EMPTY_BAR_HEIGHT;

              return (
                <S.BarStack key={item.day}>
                  {empty ? null : (
                    <S.BarValue $highlight={highlight}>
                      {formatChartValue(item.amount)}
                    </S.BarValue>
                  )}
                  <S.Bar
                    $height={height}
                    $empty={empty}
                    $highlight={highlight}
                  />
                </S.BarStack>
              );
            })}
          </S.Plot>
          <S.LabelRow>
            {data.daily.map((item) => (
              <S.DayLabel
                key={`${item.day}-label`}
                $highlight={item.day === data.highlightDay}
              >
                {item.day}
              </S.DayLabel>
            ))}
          </S.LabelRow>
        </S.Chart>
      </S.Section>

      {data.hasLastWeek && data.insight ? (
        <S.Insight>{data.insight}</S.Insight>
      ) : null}
    </BottomSheet>
  );
}

export default ReductionChangeSheet;
