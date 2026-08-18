import { fetchEventSource } from "@microsoft/fetch-event-source";
import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "./config";

export const connectButtonEvents = async (onButtonPressed) => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();

    const controller = new AbortController();

    fetchEventSource(`${API_BASE_URL}/api/demo/button-events`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "text/event-stream",
        },
        signal: controller.signal,

        onopen: async (response) => {
            if (!response.ok) {
                throw new Error(`SSE 연결 실패: ${response.status}`);
            }
        },

        onmessage: (event) => {
            if (event.event === "connected") {
                console.log("SSE 연결 완료");
                return;
            }

            if (event.event === "button-pressed") {
                onButtonPressed(JSON.parse(event.data));
            }
        },

        onerror: (error) => {
            console.error("SSE 연결 오류", error);
            throw error; // 재연결 방지하려면 throw, 자동 재시도 원하면 그냥 return
        },
    });

    return () => controller.abort();
};