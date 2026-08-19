import styled from "styled-components";
import mascotPattern from "../../assets/mascot-pattern.svg";
import PatternTopBlock from "./PatternTopBlock";

function formatHourRange(slot) {
  if (slot?.startHour == null || slot?.endHour == null) return null;
  return `${slot.startHour}~${slot.endHour}시`;
}

function buildWeeklyPatternCopy(overview) {
  const insight = overview?.insight;
  const trigger = insight?.topTrigger;
  const location = insight?.topLocation;
  const timeSlot = insight?.topTimeSlot;
  const hourRange = formatHourRange(timeSlot);
  const recentResultCount = overview?.recentResultCount;
  const topAction = overview?.effectiveActions?.[0];

  const title = trigger
    ? `${trigger.name} 가장 흔들렸어요`
    : hourRange
      ? `${hourRange}에 가장 흔들렸어요`
      : "이번 주 패턴이 보이기 시작했어요";

  const subParts = [];
  if (recentResultCount && trigger?.count != null) {
    subParts.push(`기록한 욕구 ${recentResultCount}번 중 ${trigger.count}번`);
  }
  if (location?.name) {
    subParts.push(`특히 ${location.name}에서 많았어요`);
  } else if (hourRange) {
    subParts.push(`특히 ${hourRange}에 많았어요`);
  }
  const subTitle = subParts.join(", ");

  const solution = topAction?.name ?? null;
  const similarPattern =
    topAction?.resultCount != null &&
    topAction?.avoidedImmediateSmokingCount != null
      ? {
          actionName: topAction.name,
          resultCount: topAction.resultCount,
          avoidedCount: topAction.avoidedImmediateSmokingCount,
        }
      : null;

  return { title, subTitle, solution, similarPattern };
}

function PatternHeader({ overview }) {
  const myPattern = buildWeeklyPatternCopy(overview);

  return (
    <>
      <PatternTopBlock />

      <MiddleBlock>
        <TextBlock>
          <Label>이번 주 패턴</Label>
          <Title>{myPattern.title}</Title>
          {myPattern.subTitle ? <SubTitle>{myPattern.subTitle}</SubTitle> : null}
        </TextBlock>
        <Mascot src={mascotPattern} alt="" />
      </MiddleBlock>

      {myPattern.solution || myPattern.similarPattern ? (
        <BottomBlock>
          {myPattern.solution ? (
            <Solution>
              이럴 땐 <Emphasis>{myPattern.solution}</Emphasis>
            </Solution>
          ) : null}
          {myPattern.similarPattern ? (
            <SimilarPattern>
              비슷한 상황에서 {myPattern.similarPattern.actionName}를 했을 때{" "}
              <Bold>
                {myPattern.similarPattern.resultCount}번 중{" "}
                {myPattern.similarPattern.avoidedCount}번
              </Bold>
              은 바로 흡연으로 이어지지 않았어요
            </SimilarPattern>
          ) : null}
        </BottomBlock>
      ) : null}
    </>
  );
}

export default PatternHeader;

const MiddleBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
  padding-bottom: 0.5rem;
  margin-top: 0.37rem;
`;

const TextBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  justify-content: flex-start;
  margin-top: 0.13rem;
  line-height: 1.4;
  word-break: keep-all;
`;

const Label = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem;
  font-weight: 700;
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 1.5rem;
  font-weight: 700;
`;

const SubTitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 400;
`;

const Mascot = styled.img`
  width: min(8.9375rem, 34vw);
  height: auto;
  max-height: 8.4375rem;
  object-fit: contain;
  flex-shrink: 1;
  min-width: 0;
`;

const BottomBlock = styled.div`
  max-width: 100%;
  border-top: 1px solid rgba(254, 254, 254, 0.2);
  padding-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  word-break: keep-all;
`;

const Solution = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
`;

const Emphasis = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;

const SimilarPattern = styled.p`
  max-width: 15rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
`;

const Bold = styled.span`
  font-weight: 700;
`;
