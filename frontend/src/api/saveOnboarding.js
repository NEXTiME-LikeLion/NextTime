import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "./config";
import {
    SMOKING_FREQUENCY_MAP,
    SMOKING_CONTEXT_MAP,
    TOBACCO_TYPE_MAP,
    CHANGE_GOAL_MAP,
} from "./onboardingMappers";

export const saveOnboarding = async (answers) => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();
    console.log("토큰 존재 여부:", !!accessToken);
    console.log("토큰 앞부분:", accessToken?.slice(0, 20));
    const smokingContextCodes = (answers.cravingTriggers || [])
        .slice(0, 2) // 최대 2개
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

    const response = await fetch(`${API_BASE_URL}/users/me/onboarding`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "온보딩 저장에 실패했습니다.");
    }

    const result = await response.json();
    return result.data;
};