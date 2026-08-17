import axiosInstance from "./axiosInstance";

// 추천 제외 목록 조회
export const getExcludedMissions = async () => {
    const response = await axiosInstance.get("/users/me/excluded-missions");
    return response.data.data;
};

// 다시 추천받기
export const restoreMission = async (missionId) => {
    const response = await axiosInstance.put(`/users/me/excluded-missions/${missionId}`);
    return response.data.data;
};