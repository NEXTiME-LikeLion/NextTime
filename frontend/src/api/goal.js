import axiosInstance from "./axiosInstance";
import {
    SMOKING_FREQUENCY_MAP,
    SMOKING_CONTEXT_MAP,
    TOBACCO_TYPE_MAP,
    CHANGE_GOAL_MAP,
} from "./onboardingMappers";

export const updateChangeGoal = async (fullAnswers, newChangeGoal) => {
    const smokingContextCodes = (fullAnswers.cravingTriggers || [])
        .slice(0, 2)
        .map((label) => SMOKING_CONTEXT_MAP[label]);

    const isOtherSelected = (fullAnswers.cravingTriggers || []).includes("기타");

    const body = {
        baseline: {
            smokingFrequency: SMOKING_FREQUENCY_MAP[fullAnswers.dailyAmount],
            smokingContextCodes,
            otherContext: isOtherSelected ? fullAnswers.hardestMoment || "" : null,
        },
        tobaccoTypes: (fullAnswers.smokeType || []).map((label) => TOBACCO_TYPE_MAP[label]),
        changeGoal: CHANGE_GOAL_MAP[newChangeGoal],
        difficultMoment: fullAnswers.hardestMoment || null,
    };

    const response = await axiosInstance.put("/users/me/onboarding", body);
    return response.data.data;
};

// NEXT ME(nextMe), 동기(motivation), 남긴 말(leftMessage) 저장 - POST /ai/onboarding/next-me 재사용
export const updateNextMe = async (fullAnswers) => {
    const CHANGE_REASON_MAP = {
        "체력·건강": "HEALTH_FITNESS",
        "가족·사람": "FAMILY_PEOPLE",
        "돈": "COST",
        "자유": "FREEDOM",
        "외모·냄새": "SMELL_APPEARANCE",
        "임신·아이": "PREGNANCY_CHILD",
        "취미·일상": "HOBBY_DAILY",
        "직접 입력": "OTHER",
    };

    const isOtherSelected = (fullAnswers.reasonCategory || []).includes("직접 입력");
    const changeReasons = isOtherSelected
        ? ["OTHER"]
        : (fullAnswers.reasonCategory || []).map((label) => CHANGE_REASON_MAP[label]);

    const body = {
        changeReasons,
        customReason: isOtherSelected ? fullAnswers.customReasonText || "" : null,
        decisionTrigger: fullAnswers.motivation || "",
        futureSelf: fullAnswers.nextMe || "",
        messageToFutureSelf: fullAnswers.leftMessage || "",
    };

    const response = await axiosInstance.post("/ai/onboarding/next-me", body);
    return response.data.data;
};