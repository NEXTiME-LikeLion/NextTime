import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-y: auto;
  padding-top: max(var(--safe-top), env(safe-area-inset-top, 0px));
  padding-bottom: max(var(--safe-bottom), env(safe-area-inset-bottom, 0px));
`;

export const Content = styled.div`
  width: 100%;
  padding: 40px 20px 40px;
  box-sizing: border-box;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const Description = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.bg1};
  margin-bottom: 32px;
`;

export const NextMeCard = styled.div`
  position: relative;
  width: 100%;
  min-height: 244px;
  background-color: #00d579;
  border-radius: 24px;
  padding: 36px 20px 20px;
  box-sizing: border-box;
  box-shadow: 0px 4px 8px 4px rgba(0, 0, 0, 0.12);
  margin-bottom: 24px;
`;

export const NextMeLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
`;

export const NextMeText = styled.p`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  color: #ffffff;
  margin-bottom: 8px;
  max-width: 65%;
  word-break: break-all;
  overflow-wrap: break-word;
`;

export const NextMeSubLabel = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #fefefe;
  margin-bottom: 4px;
`;

export const NextMeSubText = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: #fefefe;
  max-width: 55%;
  word-break: break-all;
  overflow-wrap: break-word;
`;

export const MascotImage = styled.img`
  position: absolute;
  right: 12px;
  bottom: 40px;
  width: 137px;
  height: 154px;
  object-fit: contain;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.bg1};
  margin-bottom: 16px;
`;

export const MemoryItem = styled.div`
  margin-bottom: 16px;
`;

export const MemoryLabel = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const MemoryText = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.bg1};
`;

export const StartButton = styled.button`
  display: block;
  width: 100%;
  max-width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 24px;
`;
