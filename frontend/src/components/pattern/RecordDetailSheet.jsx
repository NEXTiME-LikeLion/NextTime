import styled from "styled-components";
import BottomSheet from "../common/BottomSheet";

function RecordDetailSheet({ isOpen, onClose, record }) {
  if (!record) return null;

  const cravingText =
    record.status?.length === 2 ? record.status.join(" → ") : null;

  const fields =
    record.recordType === "MANUAL_SMOKING"
      ? [
          { label: "상황", value: record.moment },
          { label: "흡연 기록", value: record.record },
        ]
      : [
          { label: "미션", value: record.title },
          { label: "상황", value: record.moment },
          { label: "장소", value: record.location },
          { label: "흡연 기록", value: record.record },
          { label: "흡연 욕구", value: cravingText },
        ];

  const visibleFields = fields.filter((field) => field.value);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <DateTitle>{record.time}</DateTitle>

      <DataFields>
        {visibleFields.map((field) => (
          <Field key={field.label}>
            <FieldLabel>{field.label}</FieldLabel>
            <FieldValue>{field.value}</FieldValue>
          </Field>
        ))}
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
