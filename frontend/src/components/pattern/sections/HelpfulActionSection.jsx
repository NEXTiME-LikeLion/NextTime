import styled from "styled-components";

// TODO: API 연동 시 교체
const mockActions = [
  {
    label: "흡연구역에서 벗어나 걷기",
    detail: "장소를 옮긴 뒤 5분 걷기를 한 날에는 욕구가 빠르게 줄었어요.",
  },
  {
    label: "물 마시기",
    detail: "몸이 무거운 순간엔 물을 마신 뒤 반응이 더 안정적이었어요.",
  },
  {
    label: "호흡 정리",
    detail: "불안이 올라올 때 3번의 깊은 호흡을 한 뒤 상황이 완화됐어요.",
  },
];

function HelpfulActionSection() {
  return (
    <Section>
      <SectionTitle>나와 잘 맞았던 행동</SectionTitle>
      <ActionList>
        {mockActions.map((action) => (
          <ActionItem key={action.label}>
            <ActionBadge>추천</ActionBadge>
            <ActionText>
              <ActionLabel>{action.label}</ActionLabel>
              <ActionDetail>{action.detail}</ActionDetail>
            </ActionText>
          </ActionItem>
        ))}
      </ActionList>
    </Section>
  );
}

export default HelpfulActionSection;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.4;
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: rgba(178, 178, 178, 0.04);
  border: 1px solid rgba(178, 178, 178, 0.2);
  border-radius: 1rem;
  padding: 0.875rem 0.75rem;
`;

const ActionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  padding: 0.3rem 0.45rem;
  border-radius: 999px;
  background: rgba(0, 213, 121, 0.12);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.625rem;
  font-weight: 800;
`;

const ActionText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
`;

const ActionLabel = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
`;

const ActionDetail = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.5;
`;
