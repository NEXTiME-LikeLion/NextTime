import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  padding-top: max(var(--safe-top), env(safe-area-inset-top, 0px));
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
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
  display: block;
  width: 100%;
  max-width: 100%;
  align-self: stretch;
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

export const StatusScreen = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 0 1.25rem;
  padding-top: max(var(--safe-top), env(safe-area-inset-top, 0px));
  padding-bottom: max(var(--safe-bottom), env(safe-area-inset-bottom, 0px));
  background-color: ${({ theme }) => theme.colors.bg0};
`;

export const StatusContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 18rem;
  text-align: center;
`;

export const StatusMascot = styled.img`
  width: 7.5rem;
  height: auto;
  margin-bottom: 0.5rem;
  object-fit: contain;
`;

export const StatusTitle = styled.h2`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const HomeButton = styled.button`
  display: block;
  margin-top: 0.5rem;
  width: 100%;
  max-width: 100%;
  height: 3rem;
  border: none;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
`;