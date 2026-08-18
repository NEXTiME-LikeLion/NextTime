import axiosInstance from "./axiosInstance";

export const SMOKING_TRIGGER_OPTIONS = [
    {
        label: "일·공부 후",
        code: "WORK_OR_STUDY_ENDED",
        id: "10000000-0000-0000-0000-000000000001",
    },
    {
        label: "식사 후",
        code: "AFTER_MEAL",
        id: "10000000-0000-0000-0000-000000000002",
    },
    {
        label: "스트레스",
        code: "STRESS",
        id: "10000000-0000-0000-0000-000000000003",
    },
    {
        label: "술자리·모임",
        code: "DRINKING_OR_SOCIAL",
        id: "10000000-0000-0000-0000-000000000004",
    },
    {
        label: "심심함·습관",
        code: "BOREDOM_OR_HABIT",
        id: "10000000-0000-0000-0000-000000000005",
    },
    {
        label: "기타",
        code: "OTHER",
        id: "10000000-0000-0000-0000-000000000006",
    },
];

export const createSmokingRecord = async (triggerContextId) => {
    const body = triggerContextId ? { triggerContextId } : {};
    const response = await axiosInstance.post("/records/smoking", body);
    return response.data?.data ?? true;
};

export const getRecords = async (limit = 10) => {
    const response = await axiosInstance.get("/records", {
        params: { limit },
    });
    return response.data.data;
};
