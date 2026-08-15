import { useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import PrimaryButton from "../common/PrimaryButton";

const REASONS = [
  "업무·공부 후",
  "식사 후",
  "스트레스",
  "술자리·모임",
  "심심함·습관",
  "기타",
];

function SmokingLogModal({ isOpen, onClose, onSubmit }) {
  const [selected, setSelected] = useState("");
  const now = new Date();
  const timeText = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleModalClose = () => {
    setSelected("");
    onClose();
  };

  const handleModalSubmit = () => {
    setSelected("");
    onSubmit(selected);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      <Title>방금 피운 담배를 기록할까요?</Title>

      <TimeBlock>
        <TimeLabel>기록 시각</TimeLabel>
        <Time>{timeText} (자동)</Time>
      </TimeBlock>

      <QuestionBlock>
        <QuestionLabel>어떤 상황이었나요? (선택)</QuestionLabel>
        <OptionGrid>
          {REASONS.map((reason) => (
            <OptionButton
              key={reason}
              type="button"
              $active={selected === reason}
              onClick={() =>
                setSelected((prev) => (prev === reason ? "" : reason))
              }
            >
              {reason}
            </OptionButton>
          ))}
        </OptionGrid>
      </QuestionBlock>

      <ButtonBlock>
        <PrimaryButton type="button" onClick={handleModalSubmit}>
          기록하기
        </PrimaryButton>
        <SkipButton type="button" onClick={handleModalClose}>
          건너뛰기
        </SkipButton>
      </ButtonBlock>
    </Modal>
  );
}

export default SmokingLogModal;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

const TimeBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TimeLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 400;
  line-height: 1.4;
`;

const Time = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.bg1};
  line-height: 1.4;
`;

const QuestionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const QuestionLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray};
  line-height: 1.4;
`;

const OptionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const OptionButton = styled.button`
  display: inline-flex;
  min-height: 2.75rem;
  padding: 0.625rem 1rem;
  align-items: center;
  border-radius: 0.5rem;
  border: ${({ $active, theme }) =>
    $active
      ? `1px solid ${theme.colors.primary}`
      : `0.4px solid ${theme.colors.light_gray}`};
  background: ${({ $active }) =>
    $active ? "rgba(0, 213, 121, 0.1)" : "transparent"};
  cursor: pointer;

  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  line-height: 1.3125rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`;

const ButtonBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const SkipButton = styled.button`
  width: 100%;
  height: 3.5rem;
  border: none;
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.white};

  color: ${({ theme }) => theme.colors.gray};
  text-align: center;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;

  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
