import { useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { ensurePushSubscription } from "../api/pushNotification";

function useEnsurePushSubscription() {
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        if (cancelled) return;
        await ensurePushSubscription();
      } catch (error) {
        console.error("Push 구독 복구 실패:", error);
      }
    };

    restore();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") {
        restore();
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);
}

export default useEnsurePushSubscription;
