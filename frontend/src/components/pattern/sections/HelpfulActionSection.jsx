import styled from "styled-components";
import { SectionTitle } from "./RecentChangeSection";

function mapAction(action, index) {
  const canShowResult = (action.resultCount ?? 0) >= 2;

  return {
    id: action.missionId ?? action.code ?? action.name,
    label: action.name,
    totalCount: canShowResult ? action.resultCount : action.evaluationCount,
    overcomeCount: canShowResult
      ? action.avoidedImmediateSmokingCount
      : action.helpfulCount,
    detail: canShowResult ? "바로 피우지 않았어요" : "도움이 됐어요",
    variant: index === 0 ? "best" : "normal",
  };
}

function HelpfulActionSection({ actions = [] }) {
  const fitActions = actions.map(mapAction);

  return (
    <Section>
      <SectionTitle>나와 잘 맞았던 행동</SectionTitle>
      <ActionList>
        {fitActions.map((action) => (
          <ActionItem key={action.id}>
            <CommonText $variant={action.variant}>{action.label}</CommonText>
            <ActionText>
              <CommonText $variant={action.variant}>
                {action.totalCount}회 중 {action.overcomeCount}회
              </CommonText>
              <ActionDetail>{action.detail}</ActionDetail>
            </ActionText>
          </ActionItem>
        ))}
      </ActionList>
    </Section>
  );
}

export default HelpfulActionSection;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  line-height: 1.4;
`;

const ActionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActionItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: auto;
`;

export const CommonText = styled.p`
  color: ${({ $variant, theme }) =>
    $variant === "best" ? theme.colors.primary : theme.colors.gray};
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ActionText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ActionDetail = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 0.75rem;
  font-weight: 400;
`;
