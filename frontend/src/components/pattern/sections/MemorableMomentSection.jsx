import styled from "styled-components";

// TODO: API 연동 시 교체
const mockMoment = {
  title: "가장 생각났던 순간",
  context: "흡연구역 앞에서 가장 오래 머물 수 있었던 순간",
  description:
    "이번 주에는 퇴근 직후 흡연구역 앞을 지날 때 욕구가 가장 강하게 올라왔어요. 하지만 옆 건물로 이동해 5분 동안 걷고 나니 금방 마음이 가라앉았습니다.",
};

function MemorableMomentSection() {
  return (
    <Section>
      <SectionTitle>{mockMoment.title}</SectionTitle>
      <MomentCard>
        <MomentContext>{mockMoment.context}</MomentContext>
        <MomentDescription>{mockMoment.description}</MomentDescription>
      </MomentCard>
    </Section>
  );
}

export default MemorableMomentSection;

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

const MomentCard = styled.div`
  background: rgba(37, 40, 67, 0.04);
  border: 1px solid rgba(178, 178, 178, 0.2);
  border-radius: 1rem;
  padding: 1rem;
`;

const MomentContext = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 0.4rem;
`;

const MomentDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.6;
`;
