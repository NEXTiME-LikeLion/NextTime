import styled from "styled-components";
import BottomSheet from "./BottomSheet";

function RecordDetailSheet({ isOpen, onClose, record }) {
  if (!record) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <DateTitle>{record.time}</DateTitle>

      <DataFields>
        <Field>
          <FieldLabel>미션</FieldLabel>
          <FieldValue>{record.title}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>상황</FieldLabel>
          <FieldValue>{record.moment}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>흡연 기록</FieldLabel>
          <FieldValue>{record.record}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>흡연 욕구</FieldLabel>
          <FieldValue>
            {record.status.length === 2
              ? record.status.join(" → ")
              : record.status[0]}
          </FieldValue>
        </Field>

        <Field>
          <FieldLabel>미룬 시간</FieldLabel>
          <FieldValue>{record.delayTime}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>행동 체감</FieldLabel>
          <FieldValue>{record.actionImpact}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>내가 남긴 말</FieldLabel>
          <FieldValue>{record.myMessage}</FieldValue>
        </Field>
      </DataFields>
    </BottomSheet>
  );
}

export default RecordDetailSheet;

const DateTitle = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
`;

const DataFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FieldLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 400;
  line-height: 1.4;
`;

const FieldValue = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.bg1};
  line-height: 1.4;
`;
