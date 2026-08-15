import styled from "styled-components";
import {
  TitleBlock,
  SectionTitle,
  Subtitle,
  SummaryText,
} from "./RecentChangeSection";
import { Section, CommonText } from "./HelpfulActionSection";

// TODO: API 연동 시 교체
const mockMoment = {
  moments: [
    {
      label: "일·공부 끝난 뒤",
      count: 4,
      variant: "best",
    },
    {
      label: "스트레스",
      count: 2,
      variant: "normal",
    },
    {
      label: "식사 후",
      count: 1,
      variant: "normal",
    },
    {
      label: "술자리·모임",
      count: 0,
      variant: "normal",
    },
    {
      label: "심심함·습관",
      count: 0,
      variant: "normal",
    },
    {
      label: "기타",
      count: 0,
      variant: "normal",
    },
  ],
  description: "오후 6~8시에 가장 많았어요",
};

function MemorableMomentSection() {
  // 1. count가 0인 항목 제외
  const visibleMoments = mockMoment.moments.filter(
    (moment) => moment.count > 0,
  );

  // 2. 가장 큰 count 값 구하기 (기준값 = 100%)
  const maxCount = Math.max(...visibleMoments.map((moment) => moment.count));

  return (
    <Section>
      <TitleBlock>
        <SectionTitle>가장 생각났던 순간</SectionTitle>
        <Subtitle>바로 흡연하지 않은 기록</Subtitle>
      </TitleBlock>

      <MomentList>
        {visibleMoments.map((moment) => {
          const widthPercent = (moment.count / maxCount) * 100;

          return (
            <MomentItem key={moment.label}>
              <MomentLabel $variant={moment.variant}>
                {moment.label}
              </MomentLabel>
              <MomentContent>
                <MomentBar
                  $widthPercent={widthPercent}
                  $variant={moment.variant}
                />
                <CommonText $variant={moment.variant}>
                  {moment.count}회
                </CommonText>
              </MomentContent>
            </MomentItem>
          );
        })}
      </MomentList>

      <SummaryText>💡 {mockMoment.description}</SummaryText>
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
