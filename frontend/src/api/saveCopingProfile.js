import axiosInstance from "./axiosInstance";
import { COPING_ACTION_MAP } from "./onboardingMappers";

export const saveCopingProfile = async (answers, customInputs) => {
    const selectedLabels = answers.copingActions || [];
    const actions = selectedLabels.map((label) => COPING_ACTION_MAP[label]);
    const isOtherSelected = selectedLabels.includes("+ 직접 입력하기");

    const body = {
        actions,
        customAction: isOtherSelected ? customInputs?.copingActions || "" : null,
    };

    const response = await axiosInstance.post("/ai/onboarding/coping-profile", body);
    return response.data.data;
};