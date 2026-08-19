import { useState, useEffect } from "react";
import BackHeader from "../../components/common/BackHeader";
import * as S from "./DevicePage.styles";
import deviceImg from "../../assets/device.svg";
import device2Img from "../../assets/device2.svg";
import { getMqttStatus } from "../../api/mqttStatus";
import { connectButtonEvents } from "../../api/buttonEvents";
import PushNotificationSection from "./PushNotificationSection";

const DevicePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  // 페이지 진입 시 현재 연결 상태 확인
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getMqttStatus();
        setIsConnected(status.connected);
        if (status.lastEvent && typeof status.lastEvent === "object") {
          setLastEvent(status.lastEvent);
        }
      } catch (error) {
        console.error("기기 상태 조회 실패:", error);
      }
    };

    checkStatus();
  }, []);

  // 실시간 버튼 신호
  useEffect(() => {
    let disconnect;

    connectButtonEvents((event) => {
      console.log("버튼 신호 수신:", event);
      setLastEvent(event);
      setIsConnected(true);
    }).then((cleanup) => {
      disconnect = cleanup;
    });

    return () => {
      if (disconnect) disconnect();
    };
  }, []);

  return (
    <S.Wrapper>
      <BackHeader title="NEXTiME 기기" />

      {isConnected ? (
        <S.Content>
          <S.DeviceCard>
            <S.StatusRow>
              <S.StatusDot />
              <S.StatusText>연결됨</S.StatusText>
            </S.StatusRow>

            <S.DeviceRow>
              <S.DeviceIconWrapper>
                <S.DeviceIconImage src={device2Img} alt="" />
              </S.DeviceIconWrapper>

              <S.DeviceInfo>
                <S.DeviceName>NEXTiME Button 01</S.DeviceName>
                {lastEvent && (
                  <S.DeviceBattery>
                    마지막 신호:{" "}
                    {new Date(lastEvent.receivedAt).toLocaleTimeString()}
                  </S.DeviceBattery>
                )}
              </S.DeviceInfo>
            </S.DeviceRow>

            <S.Divider />

            <S.LastConnectedRow>
              <S.LastConnectedLabel>마지막 연결</S.LastConnectedLabel>
              <S.LastConnectedTime>
                {lastEvent
                  ? new Date(lastEvent.receivedAt).toLocaleString()
                  : "-"}
              </S.LastConnectedTime>
            </S.LastConnectedRow>
          </S.DeviceCard>
        </S.Content>
      ) : (
        <S.EmptyContent>
          <S.EmptyIconWrapper>
            <S.EmptyImage src={deviceImg} alt="" />
          </S.EmptyIconWrapper>

          <S.EmptyTitle>아직 연결된 기기가 없어요</S.EmptyTitle>
          <S.EmptyDescription>
            NEXTiME 기기를 연결하면
            <br />
            앱을 열지 않고도 흡연 순간을 빠르게 기록하고,
            <br />
            흡연 욕구를 줄이는 데에 도움을 받을 수 있어요
          </S.EmptyDescription>

          <S.FooterNote>
            기기가 없어도 NEXTiME의 모든 앱 기능을 사용할 수 있어요.
          </S.FooterNote>
        </S.EmptyContent>
      )}

      <PushNotificationSection />
    </S.Wrapper>
  );
};

export default DevicePage;
