import TabMainLayout from "../layouts/TabMainLayout";
import HomeHeader from "../components/home/HomeHeader";
import HomeContent from "../components/home/HomeContent";
import ApiStatusView from "../components/common/ApiStatusView";
import useAsync from "../hooks/useAsync";
import useRefetchOnVisit from "../hooks/useRefetchOnVisit";
import useStartNextTime from "../hooks/useStartNextTime";
import { getHome } from "../api/home";

function HomePage() {
  const { data: homeData, isLoading, error, refetch, setData } = useAsync(getHome);
  useRefetchOnVisit(refetch);
  const {
    start: startNextTime,
    isLoading: isStarting,
    error: startError,
    retry: retryStart,
  } = useStartNextTime(homeData?.activeNextTimeSession);

  const handleSmokingRecorded = (_record, nextHome) => {
    if (nextHome) setData(nextHome);
  };

  return (
    <ApiStatusView
      isLoading={(isLoading && !homeData) || isStarting}
      error={!homeData ? error : startError}
      onRetry={startError ? retryStart : refetch}
      loadingTitle={
        isStarting ? "NEXT TIME을 시작하는 중이에요" : "홈을 불러오는 중이에요"
      }
      errorTitle={
        startError ? "NEXT TIME을 시작하지 못했어요" : "불러오기에 실패했어요"
      }
    >
      {homeData ? (
        <TabMainLayout
          scrollEntirePage
          header={<HomeHeader nextMe={homeData.nextMe} />}
          content={
            <HomeContent
              todaySummary={homeData.todaySummary}
              onStartNextTime={startNextTime}
              onSmokingRecorded={handleSmokingRecorded}
            />
          }
        />
      ) : null}
    </ApiStatusView>
  );
}

export default HomePage;
