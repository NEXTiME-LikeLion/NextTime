import axiosInstance from "./axiosInstance";

export const getHome = async () => {
    return await axiosInstance.get("/home");
}
