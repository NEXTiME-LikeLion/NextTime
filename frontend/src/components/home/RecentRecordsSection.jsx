import { useNavigate } from "react-router-dom";
import * as S from "./RecentRecordsSection.styles";
import RecordList from "../pattern/RecordList";
import { mapRecordListItem } from "../pattern/mapRecordItem";

function RecentRecordsSection({ records = [], onRecordClick }) {
  const navigate = useNavigate();
  const recordList = records.map(mapRecordListItem);

  return (
    <S.Section>
      <S.SectionHeader>
        <S.SectionTitle>최근 기록</S.SectionTitle>
        <S.ViewAllButton
          type="button"
          onClick={() => navigate("/pattern/records")}
        >
          전체 보기
        </S.ViewAllButton>
      </S.SectionHeader>

      {recordList.length > 0 ? (
        <RecordList recordList={recordList} onClick={onRecordClick} />
      ) : null}
    </S.Section>
  );
}

export default RecentRecordsSection;
