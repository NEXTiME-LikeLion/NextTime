import { fetchEventSource } from "@microsoft/fetch-event-source";
import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "./config";
import { debugError, debugLog, summarizeToken } from "./debugLog";

export const connectButtonEvents = async (onButtonPressed) => {
    debugLog("SSE", "연결 시작", { baseUrl: API_BASE_URL });
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();
    debugLog("SSE", "인증 상태", summarizeToken(accessToken));

    const controller = new AbortController();
    const url = `${API_BASE_URL}/api/demo/button-events`;

    fetchEventSource(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "text/event-stream",
        },
        signal: controller.signal,

        onopen: async (response) => {
            debugLog("SSE", "onopen", {
                ok: response.ok,
                status: response.status,
                contentType: response.headers.get("content-type"),
            });
            if (!response.ok) {
                throw new Error(`SSE 연결 실패: ${response.status}`);
            }
        },

        onmessage: (event) => {
            debugLog("SSE", "onmessage", {
                event: event.event || "(empty)",
                data: event.data,
                id: event.id,
            });

            if (event.event === "connected") {
                debugLog("SSE", "연결 완료");
                return;
            }

            if (event.event === "button-pressed") {
                const parsed = JSON.parse(event.data);
                debugLog("SSE", "버튼 신호 수신", parsed);
                onButtonPressed(parsed);
            }
        },

        onerror: (error) => {
            debugError("SSE", "연결 오류", error);
            throw error;
        },
    });

    return () => {
        debugLog("SSE", "연결 해제");
        controller.abort();
    };
};
