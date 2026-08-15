import styled from "styled-components";
import { SectionTitle } from "./RecentChangeSection";

// TODO: API 연동 시 교체
const fitActions = [
  {
    label: "흡연구역에서 벗어나 걷기",
    totalCount: 3,
    overcomeCount: 2,
    detail: "흡연하지 않았어요",
    variant: "best",
  },
  {
    label: "물 마시고 심호흡 하기",
    totalCount: 2,
    overcomeCount: 1,
    detail: "흡연 욕구가 줄어들었어요",
    variant: "normal",
  },
];

function HelpfulActionSection() {
  return (
    <Section>
      <SectionTitle>나와 잘 맞았던 행동</SectionTitle>
      <ActionList>
        {fitActions.map((action) => (
          <ActionItem key={action.label}>
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
