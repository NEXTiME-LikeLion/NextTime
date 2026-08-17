import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

export const DeviceIcon = styled.img`
  width: 96px;
  height: 96px;
  margin-top: 159px;
  margin-bottom: 16px;
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
  line-height: 1.4;
  text-align: center;
  color: #68686D;
  margin-bottom: 8px;
`;

export const SubDescription = styled.p`
  font-size: 15px;
  line-height: 1.4;
  text-align: center;
  color: #68686D; 
  margin-bottom: 148px;
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
  font-weight: 500;
  cursor: pointer;
`;

export const SkipText = styled.p`
  margin-top: 16px;
  margin-bottom: 52.5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray};
  cursor: pointer;
`;