import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  position: relative;
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
  font-size: 14px;
  color: ${({ theme }) => theme.colors.bg1};
`;