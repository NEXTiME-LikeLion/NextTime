import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import RecordList from "../RecordList";
import { SectionTitle } from "./RecentChangeSection";
import { Section } from "./HelpfulActionSection";

const CRAVING_LABEL = {
  HIGH: "강함",
  MEDIUM: "보통",
  LOW: "약함",
  NONE: "없음",
};

function formatRecordedAt(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round((startOfToday - startOfTarget) / 86_400_000);
  const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

  if (diffDays === 0) return `오늘 ${time}`;
  if (diffDays === 1) return `어제 ${time}`;
  if (diffDays < 7) return `${diffDays}일 전 ${time}`;
  if (diffDays < 14) return `1주 전 ${time}`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전 ${time}`;
  if (diffDays < 60) return `1개월 전 ${time}`;
  return `${Math.floor(diffDays / 30)}개월 전 ${time}`;
}

function mapRecordStatus(record) {
  if (record.result === "SMOKED") {
    return ["바로 흡연"];
  }

  const before = CRAVING_LABEL[record.cravingBefore];
  const after = CRAVING_LABEL[record.cravingAfter];

  if (before && after) {
    return [`욕구 ${before}`, after];
  }

  if (record.result === "NOT_SMOKED") {
    return ["피우지 않았어요"];
  }

  if (record.result === "DELAYED") {
    return ["바로 피우지 않았어요"];
  }

  return [];
}

function mapRecentRecord(record) {
  return {
    id: record.recordId,
    title: record.mission?.name ?? "",
    time: formatRecordedAt(record.recordedAt),
    moment: record.trigger?.name ?? "",
    status: mapRecordStatus(record),
  };
}

function RecentRecordsSection({ records = [] }) {
  const navigate = useNavigate();
  const recordList = records.map(mapRecentRecord);

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
