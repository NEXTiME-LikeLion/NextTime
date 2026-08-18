import axiosInstance from "./axiosInstance";

export const getPatternOverview = async (period) => {
    const response = await axiosInstance.get("/patterns/overview", {
        params: period ? { period } : undefined,
    });
    return response.data.data;
};
