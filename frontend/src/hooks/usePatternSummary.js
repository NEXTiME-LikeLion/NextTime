const MIN_RECORDS_FOR_PATTERN = 5;

function usePatternSummary(overview) {
  const recordCount = overview?.recentResultCount ?? 0;
  const isReady = overview?.dataStatus === "AVAILABLE";

  return {
    isReady,
    recordCount,
    requiredCount: MIN_RECORDS_FOR_PATTERN,
  };
}

export default usePatternSummary;
