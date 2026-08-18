import axiosInstance from "./axiosInstance";

export const getHome = async () => {
    const response = await axiosInstance.get("/home");
    return response.data.data;
};
