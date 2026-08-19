import { useEffect } from "react";
import styled from "styled-components";
import BottomSheet from "../common/BottomSheet";
import ApiStatusView from "../common/ApiStatusView";
import useAsync from "../../hooks/useAsync";
import { getRecord } from "../../api/record";
import { mapRecordDetail } from "./mapRecordItem";

function RecordDetailSheet({ isOpen, onClose, recordId }) {
  const { data, isLoading, error, execute, refetch, reset } = useAsync(
    getRecord,
    { immediate: false },
  );

  useEffect(() => {
    if (!isOpen || !recordId) {
      reset();
      return;
    }

    execute(recordId);
  }, [isOpen, recordId, execute, reset]);

  const detail = data ? mapRecordDetail(data) : null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <ApiStatusView
        variant="embed"
        isLoading={Boolean(recordId) && !error && (isLoading || !data)}
        error={!data ? error : null}
        onRetry={refetch}
        loadingTitle="기록을 불러오는 중이에요"
      >
        {detail ? (
          <>
            <DateTitle>{detail.time}</DateTitle>
            <DataFields>
              {detail.fields.map((field) => (
                <Field key={field.label}>
                  <FieldLabel>{field.label}</FieldLabel>
                  <FieldValue>{field.value}</FieldValue>
                </Field>
              ))}
            </DataFields>
          </>
        ) : null}
      </ApiStatusView>
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
