import TabMainLayout from "../layouts/TabMainLayout";
import HomeHeader from "../components/home/HomeHeader";
import HomeContent from "../components/home/HomeContent";

function HomePage() {
  return <TabMainLayout header={HomeHeader} content={HomeContent} />;
}

export default HomePage;
