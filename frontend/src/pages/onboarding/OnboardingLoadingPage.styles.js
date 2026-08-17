import styled, { keyframes } from "styled-components";

const fillProgress = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

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

export const MascotWrapper = styled.div`
  position: relative;
  margin-top: 101px;
  margin-bottom: 8px;
`;

export const MascotImage = styled.img`
  width: 160px;
  height: 240px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
`;

export const Description = styled.p`
  font-size: 18px;
  line-height: 1.4;
  text-align: center;
  color: ${({ theme }) => theme.colors.bg1};
  margin-bottom: 146px;
`;

export const Footer = styled.div`
  padding: 0 20px 40px;
`;

export const ProgressBarTrack = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.light_gray};
  overflow: hidden;
  margin-bottom: 8px;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.primary};
  animation: ${fillProgress} 3s linear forwards;
`;

export const FooterText = styled.p`
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray};
`;