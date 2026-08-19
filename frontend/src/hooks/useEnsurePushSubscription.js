import { useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { ensurePushSubscription } from "../api/pushNotification";
import { debugError, debugLog } from "../api/debugLog";

function useEnsurePushSubscription() {
  useEffect(() => {
    let cancelled = false;

    const restore = async (reason) => {
      debugLog("Push", "ensurePushSubscription 호출", { reason });
      try {
        if (cancelled) return;
        const restored = await ensurePushSubscription();
        debugLog("Push", "ensurePushSubscription 결과", { restored });
      } catch (error) {
        debugError("Push", "Push 구독 복구 실패", error);
      }
    };

    restore("app-mount");

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      debugLog("Push", "Amplify auth 이벤트", { event: payload.event });
      if (payload.event === "signedIn") {
        restore("signedIn");
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);
}

export default useEnsurePushSubscription;
