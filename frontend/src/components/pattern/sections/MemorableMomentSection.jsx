import styled from "styled-components";
import {
  TitleBlock,
  SectionTitle,
  Subtitle,
  SummaryText,
} from "./RecentChangeSection";
import { Section, CommonText } from "./HelpfulActionSection";

function MemorableMomentSection({ triggers = [], topTimeSlot }) {
  const visibleMoments = triggers.filter((trigger) => trigger.count > 0);
  const maxCount = Math.max(...visibleMoments.map((moment) => moment.count), 0);
  const hourRange =
    topTimeSlot?.startHour != null && topTimeSlot?.endHour != null
      ? `${topTimeSlot.startHour}~${topTimeSlot.endHour}시`
      : null;

  if (visibleMoments.length === 0) {
    return null;
  }

  return (
    <Section>
      <TitleBlock>
        <SectionTitle>가장 생각났던 순간</SectionTitle>
        <Subtitle>최근 7일 기록</Subtitle>
      </TitleBlock>

      <MomentList>
        {visibleMoments.map((moment, index) => {
          const widthPercent =
            maxCount > 0 ? (moment.count / maxCount) * 100 : 0;
          const variant = index === 0 ? "best" : "normal";

          return (
            <MomentItem key={moment.id ?? moment.code ?? moment.name}>
              <MomentLabel $variant={variant}>{moment.name}</MomentLabel>
              <MomentContent>
                <MomentBar $widthPercent={widthPercent} $variant={variant} />
                <CommonText $variant={variant}>{moment.count}회</CommonText>
              </MomentContent>
            </MomentItem>
          );
        })}
      </MomentList>

      {hourRange ? <SummaryText>💡 {hourRange}에 가장 많았어요</SummaryText> : null}
    </Section>
  );
}

export default MemorableMomentSection;

const MomentList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MomentItem = styled.div`
  display: flex;
`;

const MomentLabel = styled(CommonText)`
  width: 10.19rem;
  flex-shrink: 0;
  text-align: start;
`;

const MomentContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.06rem;
  flex: 1;
`;

const MomentBar = styled.div`
  width: ${({ $widthPercent }) =>
    (10 * $widthPercent) / 100}rem; /* 10rem을 기준으로 계산 */
  height: 1.3125rem;
  flex-shrink: 0;
  background: ${({ $variant, theme }) =>
    $variant === "best" ? theme.colors.primary : theme.colors.light_gray};
`;
