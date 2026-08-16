import styled from "styled-components";
import SummaryCard from "../SummaryCard";
import patternArrow from "../../../assets/pattern-arrow.svg";

// TODO: API 연동 시 교체
const recentChange = {
  beforeTotalCount: 5,
  beforeOvercomeCount: 1,
  afterTotalCount: 5,
  afterOvercomeCount: 3,
  description: "퇴근 후에도 바로 피우지 않는 경우가 늘고 있어요",
};

function RecentChangeSection() {
  return (
    <Section>
      <TitleBlock>
        <SectionTitle>최근의 변화</SectionTitle>
        <Subtitle>바로 흡연하지 않은 기록</Subtitle>
      </TitleBlock>

      <SummaryBlock>
        <SummaryCard
          title="이전 7일"
          overcomeCount={recentChange.beforeOvercomeCount}
          totalCount={recentChange.beforeTotalCount}
          variant="before"
        />
        <PatternArrowIcon src={patternArrow} alt="" aria-hidden="true" />
        <SummaryCard
          title="최근 7일"
          overcomeCount={recentChange.afterOvercomeCount}
          totalCount={recentChange.afterTotalCount}
          variant="after"
        />
      </SummaryBlock>

      <SummaryText>💡 {recentChange.description}</SummaryText>
    </Section>
  );
}

export default RecentChangeSection;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.75rem;
  line-height: 1.4;
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-self: flex-start;
`;

export const SectionTitle = styled.p`
  color: #000;
  font-size: 1.125rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 0.75rem;
  font-weight: 400;
`;

const SummaryBlock = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const PatternArrowIcon = styled.img`
  width: 2.125rem;
  height: 1.25rem;
  display: block;
  flex-shrink: 0;
  object-fit: contain;
`;

export const SummaryText = styled.p`
  width: 100%;
  display: flex;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  background: rgba(178, 178, 178, 0.1);

  color: ${({ theme }) => theme.colors.bg1};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
`;
