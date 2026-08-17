import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE_URL = "http://localhost:8080";

export const registerUser = async () => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "사용자 등록에 실패했습니다.");
    }

    const result = await response.json();
    return result.data;
};