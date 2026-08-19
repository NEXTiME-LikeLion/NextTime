import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import axiosInstance from "./axiosInstance";
import { getApiErrorMessage } from "./getApiErrorMessage";

const VAPID_PUBLIC_KEY =
    "BHthC4Gfm778RfmayKaoPUGZxAVGtflbb0fwYke-sCq18vpaijdjXK7ullma8YnkQ5DVUNM5h0W8X2MjZXZvwfY";

const PUSH_ALLOWED_EMAILS = [
    "test2@example.com",
    "bella020207@naver.com",
];

const SERVICE_WORKER_URL = "/service-worker.js";

export function isPushAllowedAccount(email) {
    if (!email) {
        return false;
    }

    return PUSH_ALLOWED_EMAILS.includes(email.trim().toLowerCase());
}

export async function getCurrentUserEmail() {
    try {
        const attributes = await fetchUserAttributes();
        return attributes.email ?? null;
    } catch (error) {
        console.error("사용자 이메일 조회 실패:", error);
        return null;
    }
}

export function getPushAvailability() {
    if (typeof window === "undefined") {
        return {
            available: false,
            reason: "알림 기능을 지원하지 않는 환경입니다.",
        };
    }

    if (!window.isSecureContext) {
        return {
            available: false,
            reason: "HTTPS 환경에서만 알림을 사용할 수 있습니다.",
        };
    }

    if (!("serviceWorker" in navigator)) {
        return {
            available: false,
            reason: "Service Worker를 지원하지 않는 브라우저입니다.",
        };
    }

    if (!("PushManager" in window)) {
        return {
            available: false,
            reason:
                "iPhone에서는 Safari에서 홈 화면에 추가한 다음, 홈 화면 아이콘으로 실행해 주세요.",
        };
    }

    if (!("Notification" in window)) {
        return {
            available: false,
            reason: "알림 기능을 지원하지 않는 브라우저입니다.",
        };
    }

    return {
        available: true,
        reason: null,
    };
}

export async function registerPushServiceWorker() {
    if (!("serviceWorker" in navigator)) {
        throw new Error("Service Worker를 지원하지 않는 브라우저입니다.");
    }

    const registration = await navigator.serviceWorker.register(
        SERVICE_WORKER_URL,
        { scope: "/" },
    );
    await navigator.serviceWorker.ready;
    return registration;
}

export async function enablePushNotification() {
    await assertLoggedIn();

    const availability = getPushAvailability();
    if (!availability.available) {
        throw new Error(availability.reason);
    }

    const permission = await Notification.requestPermission();

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
    return subscription;
}

export async function disablePushNotification() {
    const registration = await getPushRegistration();
    if (!registration) {
        return;
    }

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        return;
    }

    try {
        await axiosInstance.delete("/api/push/subscriptions", {
            data: { endpoint: subscription.endpoint },
        });
    } catch (error) {
        throw new Error(
            getApiErrorMessage(error, "알림 구독 삭제에 실패했습니다."),
        );
    }

    await subscription.unsubscribe();
}

export async function isPushNotificationEnabled() {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
        return false;
    }

    if (Notification.permission !== "granted") {
        return false;
    }

    const registration = await getPushRegistration();
    if (!registration) {
        return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
}

export async function ensurePushSubscription() {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        return false;
    }

    const availability = getPushAvailability();
    if (!availability.available) {
        return false;
    }

    const session = await fetchAuthSession();
    if (!session.tokens?.accessToken) {
        return false;
    }

    const registration = await registerPushServiceWorker();
    const subscription = await getOrCreateSubscription(registration);
    await saveSubscription(subscription);
    return true;
}

async function assertLoggedIn() {
    const session = await fetchAuthSession();
    if (!session.tokens?.accessToken) {
        throw new Error("로그인이 필요합니다.");
    }
}

async function getPushRegistration() {
    if (!("serviceWorker" in navigator)) {
        return null;
    }

    return navigator.serviceWorker.getRegistration("/");
}

async function getOrCreateSubscription(registration) {
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
        return existing;
    }

    try {
        return await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64UrlToUint8Array(VAPID_PUBLIC_KEY),
        });
    } catch (error) {
        const stale = await registration.pushManager.getSubscription();
        if (!stale) {
            throw error;
        }

        await stale.unsubscribe();
        return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64UrlToUint8Array(VAPID_PUBLIC_KEY),
        });
    }
}

async function saveSubscription(subscription) {
    try {
        await axiosInstance.post(
            "/api/push/subscriptions",
            subscription.toJSON(),
        );
    } catch (error) {
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
