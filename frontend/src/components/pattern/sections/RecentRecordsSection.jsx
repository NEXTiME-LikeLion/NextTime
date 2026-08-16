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

      <RecordList recordList={mockRecentRecords} />
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
