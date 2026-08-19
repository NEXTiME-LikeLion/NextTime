import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(14, 16, 34, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
`;

export const Sheet = styled.div`
  max-width: 430px;
  height: 446px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 24px 24px 0 0;
  padding: 12px 20px 80px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.25s ease;
`;

export const Handle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.light_gray};
  margin: 0 auto 20px;
`;

export const Title = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #252843;
  margin-bottom: 8px;
`;

export const Description = styled.p`
  font-size: 13px;
  color: #252843;
  margin-bottom: 20px;
`;

/* 라디오 옵션 */

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
`;

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 4px;
  cursor: pointer;
`;

export const RadioCircle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  box-sizing: border-box;
  border: 1.967px solid
    ${({ theme, $checked }) =>
        $checked ? theme.colors.primary : theme.colors.light_gray};
  background: ${({ $checked }) =>
        $checked ? "rgba(0, 213, 121, 0.10)" : "transparent"};
  position: relative;

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ theme, $checked }) =>
        $checked ? theme.colors.primary : "transparent"};
  }
`;

export const OptionLabel = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.bg_black};
`;

export const OptionDivider = styled.hr`
  border: none;
  border-top: 1px solid #191B241A;
  margin: 0;
`;

/* 텍스트 입력 */

export const TextArea = styled.textarea`
  width: 362px;
  min-height: 140px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? "#00d579" : "#191B241A")};
  font-size: 14px;
  font-family: inherit;
  color: ${({ theme }) => theme.colors.bg_black};
  background-color: ${({ $active }) => ($active ? "#ffffff" : "#B2B2B21A")};
  resize: none;
  box-sizing: border-box;
  margin-bottom: 24px;
  outline: none;
  transition: border-color 0.15s ease;

  &::placeholder {
    color: #B2B2B2;
  }
`;

/* 버튼 */

export const SubmitButton = styled.button`
  width: 362px;
  height: 56px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  background-color: ${({ theme, disabled }) =>
        disabled ? "rgba(178, 178, 178, 0.24)" : theme.colors.primary};
  color: ${({ $active }) => ($active ? "#ffffff" : "#252843")};
  transition: background-color 0.15s ease;
  margin-top: auto;
`;

export const FooterHint = styled.p`
  text-align: center;
  font-size: 14px;
  color: #252843;
  margin-top: 8px;
`;