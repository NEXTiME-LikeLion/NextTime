import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import RecordList from "../RecordList";
import { SectionTitle } from "./RecentChangeSection";
import { Section } from "./HelpfulActionSection";
import { mapRecordListItem } from "../mapRecordItem";

function RecentRecordsSection({ records = [] }) {
  const navigate = useNavigate();
  const recordList = records.map(mapRecordListItem);

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

      {recordList.length > 0 ? <RecordList recordList={recordList} /> : null}
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
