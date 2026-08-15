import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
`;

/* ── 연결됨 ── */

export const Content = styled.div`
  padding: 0 20px;
`;

export const DeviceCard = styled.div`
  border: 1px solid #191B241A;
  border-radius: 16px;
  padding: 20px;
  margin-top: 50px;
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const StatusText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const DeviceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const DeviceIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 1px solid #191B241A;
  background-color: #F7F7FA;

`;

export const DeviceIconImage = styled.img`
  width: 30px;
  height: 30px;
`;

export const DeviceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DeviceName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.bg_black};
`;

export const DeviceBattery = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #191B241A;
  margin-bottom: 16px;
`;

export const LastConnectedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LastConnectedLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray};
`;

export const LastConnectedTime = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.bg_black};
`;

/* ── 연결 안 됨 ── */

export const EmptyContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 0;
`;

export const EmptyIconWrapper = styled.div`
  margin-bottom: 8px;
`;

export const EmptyImage = styled.img`
  width: 96px;
  height: auto;
  margin-top: 60px;
`;

export const EmptyTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #191B24;
  margin-bottom: 20px;
`;

export const EmptyDescription = styled.p`
  font-size: 16px;
  line-height: 1.4;
  text-align: center;
  color: #191B2480;
  margin-bottom: auto;
`;

export const ConnectButton = styled.button`
  width: 364px;
  height: 56px;
  border: none;
  border-radius: 16px;
  background-color:${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  margin-top: 40px;
`;

export const FooterNote = styled.p`
  margin-top: 8px;
  margin-bottom: 36px;
  font-size: 12px;
  color: #b2b2b2;
  text-align: center;
`;