import axiosInstance from "./axiosInstance";

const HEADLINE_MAX_LENGTH = 36;

const normalizeNextMe = (data = {}) => ({
    ...data,
    changeGoal: data.changeGoal ?? "",
    headline: data.headline ?? "",
    startReason: data.startReason ?? data.start_reason ?? "",
    decisionTrigger: data.decisionTrigger ?? "",
    nextBudTheme: data.nextBudTheme ?? data.nextbud_theme ?? "",
    messageToFutureSelf: data.messageToFutureSelf ?? "",
    nextMe: data.nextMe ?? data.futureSelf ?? data.headline ?? "",
    motivation: data.motivation ?? data.decisionTrigger ?? "",
    leftMessage: data.leftMessage ?? data.messageToFutureSelf ?? "",
});

export const getNextMe = async () => {
    const response = await axiosInstance.get("/ai/onboarding/next-me");
    return normalizeNextMe(response.data.data);
};

export const updateGoal = async (body) => {
    const response = await axiosInstance.post("/users/me/goal", body);
    return response.data.data;
};

export const applyGoalUpdate = (current = {}, updated = {}) => {
    const nextMe = updated.nextMe ?? current.nextMe ?? "";
    const motivation = updated.motivation ?? current.motivation ?? "";
    const leftMessage = updated.leftMessage ?? current.leftMessage ?? "";

    return {
        ...current,
        changeGoal: updated.changeGoal ?? current.changeGoal ?? "",
        nextMe,
        futureSelf: nextMe,
        headline:
            updated.nextMe != null
                ? String(updated.nextMe).slice(0, HEADLINE_MAX_LENGTH)
                : current.headline ?? "",
        motivation,
        decisionTrigger: updated.motivation ?? current.decisionTrigger ?? "",
        leftMessage,
        messageToFutureSelf: leftMessage,
    };
};
