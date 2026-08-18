import TabMainLayout from "../layouts/TabMainLayout";
import PatternHeader from "../components/pattern/PatternHeader";
import PatternContent from "../components/pattern/PatternContent";
import PatternEmptyHeader from "../components/pattern/empty/PatternEmptyHeader";
import PatternEmptyContent from "../components/pattern/empty/PatternEmptyContent";
import usePatternSummary from "../hooks/usePatternSummary";

function PatternPage() {
  // TODO: 패턴 전용 API 연동 후 recordCount 교체
  const { isReady, recordCount, requiredCount } = usePatternSummary(0);

  if (!isReady) {
    return (
      <TabMainLayout
        header={<PatternEmptyHeader />}
        content={
          <PatternEmptyContent
            recordCount={recordCount}
            requiredCount={requiredCount}
          />
        }
      />
    );
  }

  return (
    <TabMainLayout
      // TODO: API 연동 후 패턴 전달
      // header={<PatternHeader pattern={pattern} />}
      header={<PatternHeader />}
      content={<PatternContent />}
    />
  );
}

export default PatternPage;
