import { useEffect, useState } from "react";
import {
  disablePushNotification,
  enablePushNotification,
  getCurrentUserEmail,
  getPushAvailability,
  isPushAllowedAccount,
  isPushNotificationEnabled,
} from "../../api/pushNotification";
import * as S from "./DevicePage.styles";

function PushNotificationSection() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unavailableReason, setUnavailableReason] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      const email = await getCurrentUserEmail();
      if (cancelled) return;

      if (!isPushAllowedAccount(email)) {
        setIsAllowed(false);
        setIsReady(true);
        return;
      }

      setIsAllowed(true);

      const availability = getPushAvailability();
      if (!availability.available) {
        setUnavailableReason(availability.reason);
        setIsReady(true);
        return;
      }

      const enabled = await isPushNotificationEnabled();
      if (cancelled) return;

      setIsEnabled(enabled);
      setIsReady(true);
    };

    initialize().catch((error) => {
      if (cancelled) return;
      console.error("알림 상태 확인 실패:", error);
      setIsAllowed(true);
      setMessage("알림 상태를 확인하지 못했어요.");
      setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEnable = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      await enablePushNotification();
      setIsEnabled(true);
      setMessage("알림이 설정되었습니다.");
    } catch (error) {
      console.error("알림 설정 실패:", error);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      await disablePushNotification();
      setIsEnabled(false);
      setMessage("알림이 꺼졌습니다.");
    } catch (error) {
      console.error("알림 해제 실패:", error);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady || !isAllowed) {
    return null;
  }

  return (
    <S.NotificationSection>
      <S.NotificationTitle>버튼 알림</S.NotificationTitle>

      {unavailableReason ? (
        <S.NotificationMessage>{unavailableReason}</S.NotificationMessage>
      ) : (
        <>
          <S.NotificationMessage>
            {message ||
              (isEnabled
                ? "알림이 켜져 있습니다."
                : "홈 화면 앱에서 알림을 켜면, 버튼을 눌렀을 때 알림을 받을 수 있어요.")}
          </S.NotificationMessage>
          {isEnabled ? (
            <S.NotificationButton
              type="button"
              $secondary
              onClick={handleDisable}
              disabled={isLoading}
            >
              {isLoading ? "알림 해제 중..." : "알림 끄기"}
            </S.NotificationButton>
          ) : (
            <S.NotificationButton
              type="button"
              onClick={handleEnable}
              disabled={isLoading}
            >
              {isLoading ? "알림 설정 중..." : "MQTT 버튼 알림 켜기"}
            </S.NotificationButton>
          )}
        </>
      )}
    </S.NotificationSection>
  );
}

export default PushNotificationSection;
