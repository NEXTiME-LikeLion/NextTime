import axiosInstance from "./axiosInstance";

export const getMqttStatus = async () => {
    const response = await axiosInstance.get("/api/demo/mqtt/status");
    return response.data; // { connected, brokerUrl, topic, lastEvent }
};