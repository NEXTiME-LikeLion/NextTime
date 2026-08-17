const MIN_RECORDS_FOR_PATTERN = 5;

function usePatternSummary() {
  // TODO: API 연동 시 교체
  const recordCount = 2;

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
