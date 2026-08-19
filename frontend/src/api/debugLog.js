export function debugLog(scope, step, details) {
    const prefix = `[NEXTiME][${scope}]`;

    if (details !== undefined) {
        console.log(prefix, step, details);
        return;
    }

    console.log(prefix, step);
}

export function debugError(scope, step, error, extra) {
    console.error(`[NEXTiME][${scope}]`, step, extra ?? "", error);
}

export function summarizeSubscription(subscription) {
    if (!subscription) {
        return null;
    }

    const json =
        typeof subscription.toJSON === "function"
            ? subscription.toJSON()
            : subscription;

    return {
        endpoint: json.endpoint,
        expirationTime: json.expirationTime ?? null,
        hasP256dh: Boolean(json.keys?.p256dh),
        hasAuth: Boolean(json.keys?.auth),
    };
}

export function summarizeToken(accessToken) {
    if (!accessToken) {
        return { hasToken: false };
    }

    try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const expiresAt = payload.exp
            ? new Date(payload.exp * 1000).toISOString()
            : null;

        return {
            hasToken: true,
            expiresAt,
            expired: payload.exp ? Date.now() / 1000 > payload.exp : null,
        };
    } catch (error) {
        return { hasToken: true, parseError: true };
    }
}

export function getPushEnvironment() {
    if (typeof window === "undefined") {
        return { window: false };
    }

    const standalone =
        window.navigator.standalone === true ||
        window.matchMedia("(display-mode: standalone)").matches;

    return {
        href: window.location.href,
        protocol: window.location.protocol,
        isSecureContext: window.isSecureContext,
        standalone,
        displayMode: window.matchMedia("(display-mode: standalone)").matches
            ? "standalone"
            : "browser",
        userAgent: window.navigator.userAgent,
        serviceWorker: "serviceWorker" in navigator,
        pushManager: "PushManager" in window,
        notification: "Notification" in window,
        permission:
            "Notification" in window ? Notification.permission : "unsupported",
    };
}
