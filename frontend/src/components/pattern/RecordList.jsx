import styled from "styled-components";

function getCravingColor(text, theme) {
  if (text.includes("강함")) return "#FE8159";
  if (text.includes("보통")) return theme.colors.primary;
  return "inherit";
}

function StatusText({ status }) {
  if (!status?.length) return null;

  if (status.length === 2) {
    return (
      <>
        <CravingText $label={status[0]}>{status[0]}</CravingText>
        {" → "}
        <CravingText $label={status[1]}>{status[1]}</CravingText>
      </>
    );
  }

  return <CravingText $label={status[0]}>{status[0]}</CravingText>;
}

function RecordList({ recordList, onClick, ItemComponent = RecordItem }) {
  return (
    <ListWrapper>
      {recordList.map((record) => {
        const metaParts = [record.time, record.moment].filter(Boolean);

        return (
          <ItemComponent
            key={record.id}
            type="button"
            onClick={() => onClick?.(record)}
          >
            <RecordTitle>{record.title}</RecordTitle>
            <RecordMeta>
              {metaParts.map((part, index) => (
                <span key={index}>
                  {index > 0 ? " | " : null}
                  {part}
                </span>
              ))}
              {record.status?.length ? (
                <>
                  {metaParts.length > 0 ? " | " : null}
                  <StatusText status={record.status} />
                </>
              ) : null}
            </RecordMeta>
          </ItemComponent>
        );
      })}
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

const CravingText = styled.span`
  color: ${({ $label, theme }) => getCravingColor($label, theme)};
`;
