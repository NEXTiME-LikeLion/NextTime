import UrgeActionSection from "./UrgeActionSection";
import TodayChangeSection from "./TodayChangeSection";
import RecentRecordsSection from "./RecentRecordsSection";
import * as S from "./HomeContent.styles";

function HomeContent({
  todaySummary,
  recentRecords = [],
  onStartNextTime,
  onSmokingRecorded,
  onRecordClick,
  isStarting = false,
}) {
  const hasTodayRecords = (todaySummary?.totalAttemptCount ?? 0) > 0;

  return (
    <S.Container>
      <UrgeActionSection
        onStartNextTime={onStartNextTime}
        onSmokingRecorded={onSmokingRecorded}
        isStarting={isStarting}
      />
      {hasTodayRecords && <TodayChangeSection todaySummary={todaySummary} />}
      <RecentRecordsSection
        records={recentRecords}
        onRecordClick={onRecordClick}
      />
    </S.Container>
  );
}
export default HomeContent;
