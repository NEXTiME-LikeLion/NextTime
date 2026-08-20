import axiosInstance from "./axiosInstance";

const toGoalView = (data = {}) => ({
    changeGoal: data.changeGoal ?? "",
    nextMe: data.nextMe ?? data.headline ?? data.futureSelf ?? "",
    nextBudTheme: data.nextBudTheme ?? data.nextbud_theme ?? "",
    motivation: data.motivation ?? data.decisionTrigger ?? "",
    leftMessage: data.leftMessage ?? data.messageToFutureSelf ?? "",
});

export const getNextMe = async () => {
    const response = await axiosInstance.get("/ai/onboarding/next-me");
    return toGoalView(response.data.data);
};

export const updateGoal = async (body) => {
    const response = await axiosInstance.post("/users/me/goal", body);
    return toGoalView(response.data.data);
};
