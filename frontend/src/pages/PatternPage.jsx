import TabMainLayout from "../layouts/TabMainLayout";
import PatternHeader from "../components/pattern/PatternHeader";
import PatternContent from "../components/pattern/PatternContent";
import PatternEmptyHeader from "../components/pattern/empty/PatternEmptyHeader";
import PatternEmptyContent from "../components/pattern/empty/PatternEmptyContent";
import ApiStatusView from "../components/common/ApiStatusView";
import useAsync from "../hooks/useAsync";
import usePatternSummary from "../hooks/usePatternSummary";
import { getPatternOverview } from "../api/pattern";

function PatternPage() {
  const {
    data: overview,
    isLoading,
    error,
    refetch,
  } = useAsync(getPatternOverview);
  const { isReady, recordCount, requiredCount } = usePatternSummary(overview);

  return (
    <ApiStatusView
      isLoading={isLoading && !overview}
      error={!overview ? error : null}
      onRetry={refetch}
      loadingTitle="패턴을 불러오는 중이에요"
    >
      {overview ? (
        isReady ? (
          <TabMainLayout
            header={<PatternHeader overview={overview} />}
            content={<PatternContent overview={overview} />}
          />
        ) : (
          <TabMainLayout
            header={<PatternEmptyHeader />}
            content={
              <PatternEmptyContent
                recordCount={recordCount}
                requiredCount={requiredCount}
              />
            }
          />
        )
      ) : null}
    </ApiStatusView>
  );
}

export default PatternPage;
