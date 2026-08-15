import styled from "styled-components";

function RecordList({ recordList, onClick, ItemComponent = RecordItem }) {
  return (
    <ListWrapper>
      {recordList.map((record) => (
        <ItemComponent
          key={record.id}
          type="button"
          onClick={() => onClick?.(record)}
        >
          <RecordTitle>{record.title}</RecordTitle>
          <RecordMeta>
            {record.time} | {record.moment} |{" "}
            <Status $status={record.status}>
              {record.status.length === 2
                ? record.status.join(" → ")
                : record.status[0]}
            </Status>
          </RecordMeta>
        </ItemComponent>
      ))}
    </ListWrapper>
  );
}

export default RecordList;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const RecordItem = styled.button`
  border: none;
  background: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(178, 178, 178, 0.2);
`;

const RecordTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.bg1};
  line-height: 1.4;
`;

const RecordMeta = styled.p`
  color: #b2b2b2;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

const Status = styled.span``;
