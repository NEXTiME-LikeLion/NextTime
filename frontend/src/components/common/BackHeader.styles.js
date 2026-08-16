import styled from "styled-components";

export const StatusBarImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

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
  justify-content: center;
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
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.25rem;
  font-weight: 800;
  color: #252843;
  line-height: 1.4;
`;
