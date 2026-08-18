export const getApiErrorMessage = (
    error,
    fallback = "일시적인 오류가 발생했어요.\n잠시 후 다시 시도해주세요.",
) => {
    const data = error?.response?.data;
    const fieldMessages = (data?.fieldErrors ?? [])
        .map((fieldError) => fieldError?.message)
        .filter(Boolean);

    if (fieldMessages.length > 0) {
        return fieldMessages.join("\n");
    }

    return data?.message || fallback;
};
