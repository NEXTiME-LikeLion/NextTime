import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "./config";

export const getMe = async () => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    if (!accessToken) {
        return null; // 로그인 안 된 상태
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        return null; // 토큰 없거나, 등록 안 된 사용자
    }

    const result = await response.json();
    return result.data;
};