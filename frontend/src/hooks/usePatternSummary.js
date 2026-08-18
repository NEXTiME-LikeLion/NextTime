const MIN_RECORDS_FOR_PATTERN = 5;

function usePatternSummary(recordCount = 0) {
  const isReady = recordCount >= MIN_RECORDS_FOR_PATTERN;

  return {
    isReady,
    recordCount,
    requiredCount: MIN_RECORDS_FOR_PATTERN,
    pattern: isReady
      ? {
          title: "...",
          subTitle: "...",
          solution: "...",
          similarPattern: "...",
        }
      : null,
  };
}

export default usePatternSummary;
