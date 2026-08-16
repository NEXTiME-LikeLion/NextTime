import TabMainLayout from "../layouts/TabMainLayout";
import PatternHeader from "../components/pattern/PatternHeader";
import PatternContent from "../components/pattern/PatternContent";

function PatternPage(props) {
  return (
    <TabMainLayout header={<PatternHeader />} content={<PatternContent />} />
  );
}

export default PatternPage;
