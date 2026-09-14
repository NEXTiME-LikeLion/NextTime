import axiosInstance from "./axiosInstance";

export const getPatternOverview = async () => {
    const response = await axiosInstance.get("/patterns/overview");
    return response.data.data;
};