import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// TODO: API 연동 시 교체
const mockRecentRecords = [
  {
    id: 1,
    title: "퇴근 직후 흡연구역 앞",
    time: "오늘 오후 6:12",
    status: "흡연",
  },
  {
    id: 2,
    title: "점심시간 회의 직전",
    time: "어제 오후 1:08",
    status: "미룸",
  },
  {
    id: 3,
    title: "술자리 뒤 야외 흡연장",
    time: "지난주 금요일 10:42",
    status: "넘김",
  },
];

function RecentRecordsSection() {
  const navigate = useNavigate();

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>최근 기록</SectionTitle>
        <ViewAllButton
          type="button"
          onClick={() => navigate("/pattern/records")}
        >
          전체보기
        </ViewAllButton>
      </SectionHeader>

      <RecordList>
        {mockRecentRecords.map((record) => (
          <RecordItem
            key={record.id}
            type="button"
            onClick={() =>
              navigate("/pattern/records", { state: { selectedId: record.id } })
            }
          >
            <RecordTitle>{record.title}</RecordTitle>
            <RecordMeta>
              <span>{record.time}</span>
              <Status $status={record.status}>{record.status}</Status>
            </RecordMeta>
          </RecordItem>
        ))}
      </RecordList>
    </Section>
  );
}

export default RecentRecordsSection;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.4;
`;

const ViewAllButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`;

const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RecordItem = styled.button`
  width: 100%;
  border: 1px solid rgba(178, 178, 178, 0.22);
  border-radius: 1rem;
  background: rgba(178, 178, 178, 0.04);
  text-align: left;
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  cursor: pointer;
`;

const RecordTitle = styled.p`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
`;

const RecordMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.2rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  background: ${({ $status, theme }) =>
    $status === "흡연"
      ? "rgba(255, 104, 104, 0.12)"
      : $status === "미룸"
        ? "rgba(26, 136, 255, 0.12)"
        : "rgba(0, 213, 121, 0.12)"};
  color: ${({ $status, theme }) =>
    $status === "흡연"
      ? "#E34B4B"
      : $status === "미룸"
        ? "#1F6FE5"
        : theme.colors.primary};
`;
