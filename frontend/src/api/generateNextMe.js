import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "./config";
import { CHANGE_REASON_MAP } from "./onboardingMappers";

export const generateNextMe = async (answers, customInputs) => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    const isOtherSelected = (answers.reasonCategory || []).includes("직접 입력");
    const changeReasons = isOtherSelected
        ? ["OTHER"]
        : (answers.reasonCategory || []).map((label) => CHANGE_REASON_MAP[label]);

    const body = {
        changeReasons,
        customReason: isOtherSelected ? customInputs?.reasonCategory || "" : null,
        decisionTrigger: answers.motivation || "",
        futureSelf: answers.nextMe || "",
        messageToFutureSelf: answers.leftMessage || "",
    };

    const response = await fetch(`${API_BASE_URL}/ai/onboarding/next-me`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "NEXT ME 생성에 실패했습니다.");
    }

    const result = await response.json();
    return result.data; // { generationId, headline, start_reason, nextbud_theme, source, createdAt }
};