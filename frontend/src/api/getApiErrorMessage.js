export const getApiErrorMessage = (
    error,
    fallback = "일시적인 오류가 발생했어요.\n잠시 후 다시 시도해주세요.",
) => error?.response?.data?.message || fallback;
