import * as S from "./PatternContent.styles";

const TIME_AXIS = ["0", "6", "12", "18", "24"];
const GAUGE_RADIUS = 72;
const GAUGE_HALF = Math.PI * GAUGE_RADIUS;

function SuccessGauge({ percent }) {
  const clamped = Math.min(Math.max(percent, 0), 100);

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
          strokeDasharray={`${GAUGE_HALF * (clamped / 100)} ${GAUGE_HALF}`}
        />
      </S.GaugeSvg>
      <S.GaugeCenter>
        <S.GaugePercent>{clamped}%</S.GaugePercent>
        <S.GaugeRank>1위</S.GaugeRank>
      </S.GaugeCenter>
    </S.GaugeBlock>
  );
}

function PatternContent({ report }) {
  if (!report) return null;

  const peakStart = Number.parseInt(report.peakSlot, 10);
  const peakAxis = Number.isNaN(peakStart)
    ? "18"
    : String(Math.round(peakStart / 6) * 6);

  return (
    <S.Cards>
      <S.ChangeCard>
        <S.CardHeader>
          <S.Label>흡연량 변화</S.Label>
          <S.HighlightValue>{report.reductionLabel}</S.HighlightValue>
          <S.Caption>{report.caption}</S.Caption>
        </S.CardHeader>
        <S.TipBox>
          <S.TipText>{report.tip}</S.TipText>
        </S.TipBox>
      </S.ChangeCard>

      <S.TimeCard>
        <S.CardHeader>
          <S.CardHeaderRow>
            <S.Label>흡연 시간대</S.Label>
            <S.PeakBadge>가장 많음</S.PeakBadge>
          </S.CardHeaderRow>
          <S.Title>{report.peakSlot}</S.Title>
        </S.CardHeader>
        <S.Chart>
          <S.Bars>
            {report.bars.map((height, index) => (
              <S.Bar
                key={`time-bar-${index}`}
                $height={height}
                $peak={index === report.peakBarIndex}
              />
            ))}
          </S.Bars>
          <S.Axis>
            {TIME_AXIS.map((tick) => (
              <S.AxisLabel key={tick} $peak={tick === peakAxis}>
                {tick}
              </S.AxisLabel>
            ))}
          </S.Axis>
        </S.Chart>
      </S.TimeCard>

      <S.SituationCard>
        <S.CardHeader>
          <S.Label>감연하기 쉬운 상황</S.Label>
          <S.Title>{report.situation}</S.Title>
        </S.CardHeader>
        <SuccessGauge percent={report.situationRate} />
        <S.RankRow>
          {report.ranks.map((rank, index) => (
            <S.RankPill key={rank.name}>
              <S.RankOrder>{index + 2}위</S.RankOrder>
              <S.RankName>{rank.name}</S.RankName>
              <S.RankValue>{rank.rate}%</S.RankValue>
            </S.RankPill>
          ))}
        </S.RankRow>
      </S.SituationCard>

      <S.ActionCard>
        <S.CardHeader>
          <S.Label>감연에 도움이 된 추천 행동</S.Label>
          <S.Title>{report.actions[0]?.name}</S.Title>
        </S.CardHeader>
        <S.ActionList>
          {report.actions.map((action, index) => (
            <S.ActionItem key={action.name} $first={index === 0}>
              <S.ActionImageBox $height={action.height}>
                <S.ActionImage
                  src={action.image}
                  alt=""
                  width={72}
                  height={action.height}
                  $height={action.height}
                />
              </S.ActionImageBox>
              <S.ActionMeta $first={index === 0}>
                <S.ActionRank>{index + 1}위</S.ActionRank>
                <S.ActionName $first={index === 0}>{action.name}</S.ActionName>
              </S.ActionMeta>
            </S.ActionItem>
          ))}
        </S.ActionList>
      </S.ActionCard>
    </S.Cards>
  );
}

export default PatternContent;
