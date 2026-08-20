import axiosInstance from "./axiosInstance";

const toGoalView = (data = {}) => ({
    changeGoal: data.changeGoal ?? "",
    futureSelf: data.future_self ?? data.futureSelf ?? data.nextMe ?? "",
    headline: data.headline ?? "",
    nextBudTheme: data.nextbud_theme ?? data.nextBudTheme ?? "",
    motivation: data.decision_trigger ?? data.decisionTrigger ?? data.motivation ?? "",
    leftMessage:
        data.message_to_future_self ?? data.messageToFutureSelf ?? data.leftMessage ?? "",
});

export const getNextMe = async () => {
    const response = await axiosInstance.get("/ai/onboarding/next-me");
    return toGoalView(response.data.data);
};

export const updateGoal = async (body) => {
    const response = await axiosInstance.post("/users/me/goal", body);
    return toGoalView(response.data.data);
};
