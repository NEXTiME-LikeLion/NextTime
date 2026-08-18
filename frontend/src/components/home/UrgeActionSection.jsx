import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../common/PrimaryButton";
import SmokingLogModal from "../common/SmokingLogModal";
import styled from "styled-components";

function UrgeActionSection({ onSmokingRecorded }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Section>
      <TextBlock>
        <Title>담배가 생각나나요?</Title>
        <Subtitle>지금 상황에 맞는 행동을 찾아드릴게요.</Subtitle>
      </TextBlock>

      <PrimaryButton onClick={() => navigate("/next-time")}>
        NEXT TIME 시작하기
      </PrimaryButton>

      <QuickRecordRow>
        <QuickRecordLabel>방금 담배 피웠어요</QuickRecordLabel>
        <QuickRecordLink type="button" onClick={() => setIsModalOpen(true)}>
          빠르게 기록하기 →
        </QuickRecordLink>
      </QuickRecordRow>

      <SmokingLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onSmokingRecorded}
      />
    </Section>
  );
}

export default UrgeActionSection;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h3`
  color: #000;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

const Subtitle = styled.p`
  color: #000;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

const QuickRecordRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
`;

const QuickRecordLabel = styled.span`
  color: ${({ theme }) => theme.colors.bg1};
`;

const QuickRecordLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: ${({ theme }) => theme.colors.gray};
  font: inherit;
  cursor: pointer;
`;
