import TabMainLayout from "../layouts/TabMainLayout";
import HomeHeader from "../components/home/HomeHeader";
import HomeContent from "../components/home/HomeContent";
import ApiStatusView from "../components/common/ApiStatusView";
import useAsync from "../hooks/useAsync";
import { getHome } from "../api/home";

function HomePage() {
  const { data: homeData, isLoading, error, refetch } = useAsync(getHome);

  return (
    <ApiStatusView
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      loadingTitle="홈을 불러오는 중이에요"
    >
      {homeData ? (
        <TabMainLayout
          header={<HomeHeader nextMe={homeData.nextMe} />}
          content={<HomeContent todaySummary={homeData.todaySummary} />}
        />
      ) : null}
    </ApiStatusView>
  );
}

export default HomePage;
