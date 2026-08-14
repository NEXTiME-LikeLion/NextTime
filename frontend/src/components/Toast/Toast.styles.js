import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 8px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

export const ToastWrapper = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 28px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.brand.toast.bg};
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: ${slideUp} 0.25s ease;
`;

export const Icon = styled.span`
  font-size: 18px;
  line-height: 1;
`;