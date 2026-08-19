import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import axiosInstance from "./axiosInstance";
import { getApiErrorMessage } from "./getApiErrorMessage";
import {
    debugError,
    debugLog,
    getPushEnvironment,
    summarizeSubscription,
    summarizeToken,
} from "./debugLog";

const VAPID_PUBLIC_KEY =
    "BHthC4Gfm778RfmayKaoPUGZxAVGtflbb0fwYke-sCq18vpaijdjXK7ullma8YnkQ5DVUNM5h0W8X2MjZXZvwfY";

const PUSH_ALLOWED_EMAILS = [
    "test2@example.com",
    "bella020207@naver.com",
];

const SERVICE_WORKER_URL = "/service-worker.js";

export function isPushAllowedAccount(email) {
    if (!email) {
        debugLog("Push", "허용 계정 아님", { email });
        return false;
    }

    const allowed = PUSH_ALLOWED_EMAILS.includes(email.trim().toLowerCase());
    debugLog("Push", "허용 계정 확인", { email, allowed });
    return allowed;
}

export async function getCurrentUserEmail() {
    try {
        const attributes = await fetchUserAttributes();
        const email = attributes.email ?? null;
        debugLog("Push", "사용자 이메일 조회 성공", { email });
        return email;
    } catch (error) {
        debugError("Push", "사용자 이메일 조회 실패", error);
        return null;
    }
}

export function getPushAvailability() {
    const environment = getPushEnvironment();
    debugLog("Push", "환경 점검", environment);

    if (typeof window === "undefined") {
        return {
            available: false,
            reason: "알림 기능을 지원하지 않는 환경입니다.",
        };
    }

    if (!window.isSecureContext) {
        debugLog("Push", "사용 불가", { reason: "insecure-context" });
        return {
            available: false,
            reason: "HTTPS 환경에서만 알림을 사용할 수 있습니다.",
        };
    }

    if (!("serviceWorker" in navigator)) {
        debugLog("Push", "사용 불가", { reason: "no-service-worker" });
        return {
            available: false,
            reason: "Service Worker를 지원하지 않는 브라우저입니다.",
        };
    }

    if (!("PushManager" in window)) {
        debugLog("Push", "사용 불가", { reason: "no-push-manager" });
        return {
            available: false,
            reason:
                "iPhone에서는 Safari에서 홈 화면에 추가한 다음, 홈 화면 아이콘으로 실행해 주세요.",
        };
    }

    if (!("Notification" in window)) {
        debugLog("Push", "사용 불가", { reason: "no-notification" });
        return {
            available: false,
            reason: "알림 기능을 지원하지 않는 브라우저입니다.",
        };
    }

    debugLog("Push", "사용 가능");
    return {
        available: true,
        reason: null,
    };
}

export async function registerPushServiceWorker() {
    debugLog("Push", "Service Worker 등록 시작", { url: SERVICE_WORKER_URL });

    if (!("serviceWorker" in navigator)) {
        throw new Error("Service Worker를 지원하지 않는 브라우저입니다.");
    }

    const registration = await navigator.serviceWorker.register(
        SERVICE_WORKER_URL,
        { scope: "/" },
    );
    debugLog("Push", "Service Worker register() 완료", {
        scope: registration.scope,
        active: Boolean(registration.active),
        installing: Boolean(registration.installing),
        waiting: Boolean(registration.waiting),
    });

    const ready = await navigator.serviceWorker.ready;
    debugLog("Push", "Service Worker ready", {
        scope: ready.scope,
        activeScript: ready.active?.scriptURL,
        state: ready.active?.state,
    });
    return registration;
}

export async function enablePushNotification() {
    debugLog("Push", "알림 켜기 시작");
    await assertLoggedIn();

    const availability = getPushAvailability();
    if (!availability.available) {
        debugLog("Push", "알림 켜기 중단 - 사용 불가", availability);
        throw new Error(availability.reason);
    }

    debugLog("Push", "권한 요청 전", {
        permission: Notification.permission,
    });
    const permission = await Notification.requestPermission();
    debugLog("Push", "권한 요청 결과", { permission });

    if (permission === "denied") {
        throw new Error(
            "알림 권한이 거부되었습니다. iPhone 설정에서 NEXTiME 알림을 허용해 주세요.",
        );
    }

    if (permission !== "granted") {
        throw new Error("알림 권한을 허용해야 사용할 수 있습니다.");
    }

    const registration = await registerPushServiceWorker();
    const subscription = await getOrCreateSubscription(registration);
    await saveSubscription(subscription);
    debugLog("Push", "알림 켜기 완료", summarizeSubscription(subscription));
    return subscription;
}

export async function disablePushNotification() {
    debugLog("Push", "알림 끄기 시작");
    const registration = await getPushRegistration();
    if (!registration) {
        debugLog("Push", "알림 끄기 중단 - Service Worker 없음");
        return;
    }

    const subscription = await registration.pushManager.getSubscription();
    debugLog("Push", "현재 브라우저 구독", summarizeSubscription(subscription));
    if (!subscription) {
        debugLog("Push", "알림 끄기 중단 - 브라우저 구독 없음");
        return;
    }

    try {
        debugLog("Push", "DELETE /api/push/subscriptions 요청", {
            endpoint: subscription.endpoint,
        });
        const response = await axiosInstance.delete("/api/push/subscriptions", {
            data: { endpoint: subscription.endpoint },
        });
        debugLog("Push", "DELETE 성공", { status: response.status });
    } catch (error) {
        debugError("Push", "DELETE 실패", error, {
            status: error?.response?.status,
            data: error?.response?.data,
        });
        throw new Error(
            getApiErrorMessage(error, "알림 구독 삭제에 실패했습니다."),
        );
    }

    await subscription.unsubscribe();
    debugLog("Push", "브라우저 구독 해제 완료");
}

export async function isPushNotificationEnabled() {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
        debugLog("Push", "알림 활성 여부", { enabled: false, reason: "unsupported" });
        return false;
    }

    if (Notification.permission !== "granted") {
        debugLog("Push", "알림 활성 여부", {
            enabled: false,
            reason: "permission",
            permission: Notification.permission,
        });
        return false;
    }

    const registration = await getPushRegistration();
    if (!registration) {
        debugLog("Push", "알림 활성 여부", {
            enabled: false,
            reason: "no-registration",
        });
        return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    const enabled = subscription !== null;
    debugLog("Push", "알림 활성 여부", {
        enabled,
        permission: Notification.permission,
        subscription: summarizeSubscription(subscription),
    });
    return enabled;
}

export async function ensurePushSubscription() {
    debugLog("Push", "구독 복구 시도", getPushEnvironment());

    if (!("Notification" in window) || Notification.permission !== "granted") {
        debugLog("Push", "구독 복구 건너뜀 - 권한 없음", {
            permission:
                "Notification" in window
                    ? Notification.permission
                    : "unsupported",
        });
        return false;
    }

    const availability = getPushAvailability();
    if (!availability.available) {
        debugLog("Push", "구독 복구 건너뜀 - 사용 불가", availability);
        return false;
    }

    const session = await fetchAuthSession();
    const tokenInfo = summarizeToken(session.tokens?.accessToken?.toString());
    debugLog("Push", "구독 복구 인증 상태", tokenInfo);
    if (!session.tokens?.accessToken) {
        return false;
    }

    const registration = await registerPushServiceWorker();
    const subscription = await getOrCreateSubscription(registration);
    await saveSubscription(subscription);
    debugLog("Push", "구독 복구 완료", summarizeSubscription(subscription));
    return true;
}

async function assertLoggedIn() {
    const session = await fetchAuthSession();
    const tokenInfo = summarizeToken(session.tokens?.accessToken?.toString());
    debugLog("Push", "로그인 상태", tokenInfo);
    if (!session.tokens?.accessToken) {
        throw new Error("로그인이 필요합니다.");
    }
}

async function getPushRegistration() {
    if (!("serviceWorker" in navigator)) {
        return null;
    }

    const registration = await navigator.serviceWorker.getRegistration("/");
    debugLog("Push", "Service Worker 조회", {
        found: Boolean(registration),
        scope: registration?.scope,
        activeScript: registration?.active?.scriptURL,
    });
    return registration;
}

async function getOrCreateSubscription(registration) {
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
        debugLog("Push", "기존 구독 재사용", summarizeSubscription(existing));
        return existing;
    }

    debugLog("Push", "새 Push 구독 생성 시작");
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64UrlToUint8Array(VAPID_PUBLIC_KEY),
        });
        debugLog("Push", "새 구독 생성 성공", summarizeSubscription(subscription));
        return subscription;
    } catch (error) {
        debugError("Push", "구독 생성 실패, 재시도 여부 확인", error);
        const stale = await registration.pushManager.getSubscription();
        if (!stale) {
            throw error;
        }

        debugLog("Push", "오래된 구독 해제 후 재구독", summarizeSubscription(stale));
        await stale.unsubscribe();
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64UrlToUint8Array(VAPID_PUBLIC_KEY),
        });
        debugLog("Push", "재구독 성공", summarizeSubscription(subscription));
        return subscription;
    }
}

async function saveSubscription(subscription) {
    const payload = subscription.toJSON();
    debugLog("Push", "POST /api/push/subscriptions 요청", {
        endpoint: payload.endpoint,
        expirationTime: payload.expirationTime ?? null,
        hasKeys: Boolean(payload.keys?.p256dh && payload.keys?.auth),
    });

    try {
        const response = await axiosInstance.post(
            "/api/push/subscriptions",
            payload,
        );
        debugLog("Push", "POST 성공", { status: response.status });
    } catch (error) {
        debugError("Push", "POST 실패", error, {
            status: error?.response?.status,
            data: error?.response?.data,
        });
        if (error?.response?.status === 401) {
            throw new Error("로그인이 만료되었습니다. 다시 로그인해 주세요.");
        }

        throw new Error(
            getApiErrorMessage(error, "알림 등록에 실패했습니다."),
        );
    }
}

function base64UrlToUint8Array(base64Url) {
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(base64);

    return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}
