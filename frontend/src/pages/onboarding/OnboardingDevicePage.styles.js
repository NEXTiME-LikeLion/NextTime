import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const StatusBarImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

export const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.light_gray};
  margin-bottom: 24px;
`;

export const DeviceIcon = styled.img`
  width: 32px;
  height: 32px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  text-align: center;
`;

export const Description = styled.p`
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
  color: ${({ theme }) => theme.colors.bg1};
  margin-bottom: 40px;
`;

export const ConnectButton = styled.button`
  width: 100%;
  max-width: 363px;
  height: 56px;
  border: none;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

export const SkipText = styled.p`
  margin-top: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray};
  cursor: pointer;
`;