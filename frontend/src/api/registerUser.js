import axiosInstance from "./axiosInstance";

export const registerUser = async () => {
    const response = await axiosInstance.post("/users");
    return response.data.data;
};