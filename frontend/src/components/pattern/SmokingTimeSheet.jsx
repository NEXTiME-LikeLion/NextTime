import BottomSheet from "../common/BottomSheet";
import { getSmokingTime } from "./patternReport";
import * as S from "./SmokingTimeSheet.styles";

const MAX_BAR_HEIGHT = 76;
const EMPTY_BAR_HEIGHT = 8;

function formatCount(value) {
  if (value == null) return "";
  return `${value}회`;
}

function SmokingTimeSheet({ isOpen, onClose, report }) {
  const data = getSmokingTime(report);
  const scaleMax = Math.max(...data.slots.map((slot) => slot.count), 0);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <S.Header>
        <S.Title>흡연 시간대 변화</S.Title>
        <S.Subtitle>
          가장 많이 피운 시간대와 횟수를 지난주와 비교했어요
        </S.Subtitle>
      </S.Header>

      <S.CompareRow>
        <S.PeakCard $tone="muted" $empty={!data.hasLastWeek}>
          <S.PeakLabel>지난주</S.PeakLabel>
          {data.hasLastWeek ? (
            <>
              <S.PeakSlot>{data.lastWeekPeak.slot}</S.PeakSlot>
              <S.PeakCount>{formatCount(data.lastWeekPeak.count)}</S.PeakCount>
            </>
          ) : (
            <S.PeakEmpty>
              기록이 쌓이면 지난주와
              <br />
              비교가 가능해져요!
            </S.PeakEmpty>
          )}
        </S.PeakCard>
        <S.PeakCard $tone="current">
          <S.PeakLabel>이번 주</S.PeakLabel>
          <S.PeakSlot>{data.thisWeekPeak.slot}</S.PeakSlot>
          <S.PeakCount $tone="current">
            {formatCount(data.thisWeekPeak.count)}
          </S.PeakCount>
        </S.PeakCard>
      </S.CompareRow>

      <S.Section>
        <S.SectionTitle>이번 주 시간대별 흡연</S.SectionTitle>
        <S.Chart>
          <S.Plot>
            {data.slots.map((slot) => {
              const height =
                slot.count <= 0 || scaleMax <= 0
                  ? EMPTY_BAR_HEIGHT
                  : (slot.count / scaleMax) * MAX_BAR_HEIGHT;

              return (
                <S.BarCol key={slot.label}>
                  <S.BarStack>
                    <S.BarValue $peak={slot.peak}>{slot.count}</S.BarValue>
                    <S.Bar $height={height} $peak={slot.peak} />
                  </S.BarStack>
                  <S.BarLabel $peak={slot.peak}>{slot.label}</S.BarLabel>
                </S.BarCol>
              );
            })}
          </S.Plot>
        </S.Chart>
      </S.Section>

      <S.Section>
        <S.SectionTitle>요일별 자주 피운 시간</S.SectionTitle>
        <S.WeekBox>
          <S.WeekRow>
            {data.weekdayPeaks.map((item) => (
              <S.WeekPill key={item.day}>
                <S.WeekDay>{item.day}</S.WeekDay>
                <S.WeekHour>{item.hour ?? "-"}</S.WeekHour>
              </S.WeekPill>
            ))}
          </S.WeekRow>
        </S.WeekBox>
      </S.Section>

      {data.hasLastWeek && data.insight ? (
        <S.Insight>{data.insight}</S.Insight>
      ) : null}
    </BottomSheet>
  );
}

export default SmokingTimeSheet;
