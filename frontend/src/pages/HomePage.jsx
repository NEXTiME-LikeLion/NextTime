import TabMainLayout from "../layouts/TabMainLayout";
import HomeHeader from "../components/home/HomeHeader";
import HomeContent from "../components/home/HomeContent";
import { useEffect, useState } from "react";
import { getHome } from "../api/home";

function HomePage() {
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHome()
    .then((res) => {
      setHomeData(res.data);
    })
    .catch((err) => {
      console.error(err);
      setHomeData(null);
    })
    .finally(()=> 
      setIsLoading(false)
    );
  }, []);

  if (isLoading) {
    return <div>로딩 중입니다.</div>;
  }
  if (!homeData) {
    return <div>에러가 발생했어요. 다시 시도해주세요.</div>;
  }

  return <TabMainLayout 
    header={<HomeHeader nextMe={homeData.nextMe} />} 
    content={<HomeContent todaySummary={homeData.todaySummary} />} 
  />;
}


export default HomePage;
