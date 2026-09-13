import * as S from "./PatternContent.styles";
import actionWalk from "../../assets/pattern/action-walk.png";
import actionWater from "../../assets/pattern/action-water.png";
import actionBreathe from "../../assets/pattern/action-breathe.png";

const TIME_BARS = [12, 20, 28, 21, 34, 46, 64, 30, 30];
const TIME_AXIS = [
  { label: "0", peak: false },
  { label: "6", peak: false },
  { label: "12", peak: false },
  { label: "18", peak: true },
  { label: "24", peak: false },
];
const PEAK_BAR_INDEX = 6;
const GAUGE_RADIUS = 72;
const GAUGE_HALF = Math.PI * GAUGE_RADIUS;

function SuccessGauge() {
  return (
    <S.GaugeBlock>
      <S.GaugeSvg viewBox="0 0 180 100" aria-hidden>
        <path
          d="M 18 90 A 72 72 0 0 1 162 90"
          fill="none"
          stroke="#d8eee4"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M 18 90 A 72 72 0 0 1 162 90"
          fill="none"
          stroke="#00D579"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={`${GAUGE_HALF * 0.75} ${GAUGE_HALF}`}
        />
      </S.GaugeSvg>
      <S.GaugeCenter>
        <S.GaugePercent>75%</S.GaugePercent>
        <S.GaugeRank>1위</S.GaugeRank>
      </S.GaugeCenter>
    </S.GaugeBlock>
  );
}

function PatternContent() {
  return (
    <S.Cards>
      <S.ChangeCard>
        <S.CardHeader>
          <S.Label>흡연량 변화</S.Label>
          <S.HighlightValue>1.4개비 ↓</S.HighlightValue>
          <S.Caption>
            지난주 평균 10.2개비 → 이번 주 평균 8.8개비로 줄었어요
          </S.Caption>
        </S.CardHeader>
        <S.TipBox>
          <S.TipText>
            이번 주에는 일·공부가 끝난 후 걷기로 감연해봐요
          </S.TipText>
        </S.TipBox>
      </S.ChangeCard>

      <S.TimeCard>
        <S.CardHeader>
          <S.CardHeaderRow>
            <S.Label>흡연 시간대</S.Label>
            <S.PeakBadge>가장 많음</S.PeakBadge>
          </S.CardHeaderRow>
          <S.Title>18–21시</S.Title>
        </S.CardHeader>
        <S.Chart>
          <S.Bars>
            {TIME_BARS.map((height, index) => (
              <S.Bar
                key={`time-bar-${index}`}
                $height={height}
                $peak={index === PEAK_BAR_INDEX}
              />
            ))}
          </S.Bars>
          <S.Axis>
            {TIME_AXIS.map((tick) => (
              <S.AxisLabel key={tick.label} $peak={tick.peak}>
                {tick.label}
              </S.AxisLabel>
            ))}
          </S.Axis>
        </S.Chart>
      </S.TimeCard>

      <S.SituationCard>
        <S.CardHeader>
          <S.Label>감연하기 쉬운 상황</S.Label>
          <S.Title>일·공부가 끝난 후</S.Title>
        </S.CardHeader>
        <SuccessGauge />
        <S.RankRow>
          <S.RankPill>
            <S.RankOrder>2위</S.RankOrder>
            <S.RankName>스트레스</S.RankName>
            <S.RankValue>33%</S.RankValue>
          </S.RankPill>
          <S.RankPill>
            <S.RankOrder>3위</S.RankOrder>
            <S.RankName>식사 후</S.RankName>
            <S.RankValue>25%</S.RankValue>
          </S.RankPill>
        </S.RankRow>
      </S.SituationCard>

      <S.ActionCard>
        <S.CardHeader>
          <S.Label>감연에 도움이 된 추천 행동</S.Label>
          <S.Title>걷기</S.Title>
        </S.CardHeader>
        <S.ActionList>
          <S.ActionItem $first>
            <S.ActionImageBox $height={102}>
              <S.ActionImage
                src={actionWalk}
                alt=""
                width={72}
                height={102}
                $height={102}
              />
            </S.ActionImageBox>
            <S.ActionMeta $first>
              <S.ActionRank>1위</S.ActionRank>
              <S.ActionName $first>걷기</S.ActionName>
            </S.ActionMeta>
          </S.ActionItem>
          <S.ActionItem>
            <S.ActionImageBox $height={95}>
              <S.ActionImage
                src={actionWater}
                alt=""
                width={72}
                height={95}
                $height={95}
              />
            </S.ActionImageBox>
            <S.ActionMeta>
              <S.ActionRank>2위</S.ActionRank>
              <S.ActionName>물 마시기</S.ActionName>
            </S.ActionMeta>
          </S.ActionItem>
          <S.ActionItem>
            <S.ActionImageBox $height={94}>
              <S.ActionImage
                src={actionBreathe}
                alt=""
                width={72}
                height={94}
                $height={94}
              />
            </S.ActionImageBox>
            <S.ActionMeta>
              <S.ActionRank>3위</S.ActionRank>
              <S.ActionName>심호흡 하기</S.ActionName>
            </S.ActionMeta>
          </S.ActionItem>
        </S.ActionList>
      </S.ActionCard>
    </S.Cards>
  );
}

export default PatternContent;
