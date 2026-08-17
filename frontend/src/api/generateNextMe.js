import axiosInstance from "./axiosInstance";
import { CHANGE_REASON_MAP } from "./onboardingMappers";

export const generateNextMe = async (answers, customInputs) => {
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

    const response = await axiosInstance.post("/ai/onboarding/next-me", body);
    return response.data.data;
};