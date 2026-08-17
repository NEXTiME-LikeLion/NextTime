import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "./config";
import { COPING_ACTION_MAP } from "./onboardingMappers";

export const saveCopingProfile = async (answers, customInputs) => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    const selectedLabels = answers.copingActions || [];
    const actions = selectedLabels.map((label) => COPING_ACTION_MAP[label]);
    const isOtherSelected = selectedLabels.includes("+ 직접 입력하기");

    const body = {
        actions,
        customAction: isOtherSelected ? customInputs?.copingActions || "" : null,
    };

    const response = await fetch(`${API_BASE_URL}/ai/onboarding/coping-profile`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "대처 행동 저장에 실패했습니다.");
    }

    const result = await response.json();
    return result.data;
};