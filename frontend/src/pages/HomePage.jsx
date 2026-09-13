import { useCallback, useState } from "react";
import TabMainLayout from "../layouts/TabMainLayout";
import HomeHeader from "../components/home/HomeHeader";
import HomeContent from "../components/home/HomeContent";
import RecordDetailSheet from "../components/pattern/RecordDetailSheet";
import useAsync from "../hooks/useAsync";
import useRefetchOnVisit from "../hooks/useRefetchOnVisit";
import useStartNextTime from "../hooks/useStartNextTime";
import { getHome } from "../api/home";
import { getRecords } from "../api/record";

function HomePage() {
  const { data: homeData, refetch, setData } = useAsync(getHome);
  const { data: recordsData, refetch: refetchRecords } = useAsync(() =>
    getRecords(3),
  );
  const refetchAll = useCallback(() => {
    refetch();
    refetchRecords();
  }, [refetch, refetchRecords]);
  useRefetchOnVisit(refetchAll);
  const { start: startNextTime, isLoading: isStarting } = useStartNextTime(
    homeData?.activeNextTimeSession,
  );
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSmokingRecorded = (_record, nextHome) => {
    if (nextHome) setData(nextHome);
    refetchRecords();
  };

  const handleRecordClick = (record) => {
    setSelectedRecordId(record.id);
    setIsSheetOpen(true);
  };

  if (!homeData) return null;

  return (
    <>
      <TabMainLayout
        scrollEntirePage
        header={<HomeHeader nextMe={homeData.nextMe} />}
        content={
          <HomeContent
            todaySummary={homeData.todaySummary}
            recentRecords={recordsData?.records ?? []}
            onStartNextTime={startNextTime}
            onSmokingRecorded={handleSmokingRecorded}
            onRecordClick={handleRecordClick}
            isStarting={isStarting}
          />
        }
      />
      <RecordDetailSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        recordId={selectedRecordId}
      />
    </>
  );
}

export default HomePage;
