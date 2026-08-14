import { useState } from "react";
import BackHeader from "../../components/common/BackHeader";
import * as S from "./DevicePage.styles";
import deviceImg from "../../assets/device.svg";
import device2Img from "../../assets/device2.svg";

const DevicePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [device] = useState({
    name: "NEXTiME Button 01",
    battery: 82,
    lastConnected: "오늘 18:24",
  });

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
                <S.DeviceName>{device.name}</S.DeviceName>
                <S.DeviceBattery>배터리 {device.battery}%</S.DeviceBattery>
              </S.DeviceInfo>
            </S.DeviceRow>

            <S.Divider />

            <S.LastConnectedRow>
              <S.LastConnectedLabel>마지막 연결</S.LastConnectedLabel>
              <S.LastConnectedTime>{device.lastConnected}</S.LastConnectedTime>
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

          <S.ConnectButton onClick={() => setIsConnected(true)}>
            기기 연결하기
          </S.ConnectButton>

          <S.FooterNote>
            기기가 없어도 NEXTiME의 모든 앱 기능을 사용할 수 있어요.
          </S.FooterNote>
        </S.EmptyContent>
      )}
    </S.Wrapper>
  );
};

export default DevicePage;
