import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import RecordList from "../RecordList";
import { SectionTitle } from "./RecentChangeSection";
import { Section } from "./HelpfulActionSection";

// TODO: API 연동 시 교체
const mockRecentRecords = [
  {
    id: 1,
    title: "흡연구역에서 벗어나 5분 걷기",
    time: "오늘 18:24",
    moment: "일·공부 끝난 뒤",
    status: ["욕구 강함", "보통"],
  },
  {
    id: 2,
    title: "물 마시기",
    time: "오늘 13:11",
    moment: "식사 후",
    status: ["11분 미룸", "이후 흡연"],
  },
  {
    id: 3,
    title: "흡연구역에서 벗어나 5분 걷기",
    time: "오늘 9:12",
    moment: "일·공부 끝난 뒤",
    status: ["바로 흡연"],
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
          전체 보기
        </ViewAllButton>
      </SectionHeader>

      <RecordList RecordList={mockRecentRecords} />
    </Section>
  );
}

export default RecentRecordsSection;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ViewAllButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.light_gray};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  line-height: 1.4;
`;

export const RecordList = styled.div`
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

export const RecordTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.bg1};
  line-height: 1.4;
`;

export const RecordMeta = styled.p`
  color: #b2b2b2;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const Status = styled.span``;
