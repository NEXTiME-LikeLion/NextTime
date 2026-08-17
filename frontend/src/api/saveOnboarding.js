import axiosInstance from "./axiosInstance";
import {
    SMOKING_FREQUENCY_MAP,
    SMOKING_CONTEXT_MAP,
    TOBACCO_TYPE_MAP,
    CHANGE_GOAL_MAP,
} from "./onboardingMappers";

export const saveOnboarding = async (answers) => {
    const smokingContextCodes = (answers.cravingTriggers || [])
        .slice(0, 2)
        .map((label) => SMOKING_CONTEXT_MAP[label]);

    const isOtherSelected = (answers.cravingTriggers || []).includes("기타");

    const body = {
        baseline: {
            smokingFrequency: SMOKING_FREQUENCY_MAP[answers.dailyAmount],
            smokingContextCodes,
            otherContext: isOtherSelected ? answers.hardestMoment || "" : null,
        },
        tobaccoTypes: (answers.smokeType || []).map((label) => TOBACCO_TYPE_MAP[label]),
        changeGoal: CHANGE_GOAL_MAP[answers.desiredChange],
        difficultMoment: answers.hardestMoment || null,
    };

    const response = await axiosInstance.put("/users/me/onboarding", body);
    return response.data.data;
};