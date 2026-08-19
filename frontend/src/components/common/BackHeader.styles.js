import styled from "styled-components";

const SAFE_TOP = "max(var(--safe-top), env(safe-area-inset-top, 0px))";

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  padding-top: ${SAFE_TOP};
  min-height: calc(32px + ${SAFE_TOP});
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  position: absolute;
  left: 20px;
  top: ${SAFE_TOP};
`;

export const ArrowIcon = styled.svg`
  width: 22px;
  height: 22px;
  fill: none;
  stroke: ${({ theme }) => theme.colors.bg_black};
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 800;
  color: #252843;
  line-height: 1.4;
`;

export const RightContent = styled.div`
  position: absolute;
  right: 20px;
  top: ${SAFE_TOP};
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.bg1};
`;