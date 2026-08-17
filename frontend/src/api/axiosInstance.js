import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "./config";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// 모든 요청에 자동으로 토큰을 붙여주는 인터셉터
axiosInstance.interceptors.request.use(async (config) => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default axiosInstance;