import axiosInstance from "./axiosInstance";

export const getMe = async () => {
    try {
        const response = await axiosInstance.get("/users/me");
        return response.data.data;
    } catch (error) {
        return null;
    }
};