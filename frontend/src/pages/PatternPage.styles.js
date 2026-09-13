import styled, { css } from "styled-components";

const SAFE_TOP = "max(var(--safe-top), env(safe-area-inset-top, 0px))";
export const PATTERN_BG = "#eef7f3";

const hideScrollbar = css`
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Screen = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: ${PATTERN_BG};
  overflow: hidden;
`;

export const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(17.625rem + ${SAFE_TOP});
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

export const HeroImage = styled.img`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 39.375rem;
  object-fit: cover;
  object-position: center bottom;
`;

export const HeroFade = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 5rem;
  background: ${({ $preparing }) =>
    $preparing
      ? `linear-gradient(
          to bottom,
          rgba(245, 251, 248, 0) 0%,
          rgba(225, 233, 229, 0.5) 43.269%,
          #e1e9e5 100%
        )`
      : `linear-gradient(
          to bottom,
          rgba(245, 251, 248, 0) 0%,
          rgba(238, 247, 243, 0.5) 43.269%,
          ${PATTERN_BG} 100%
        )`};
`;

export const SafeTop = styled.div`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  height: ${SAFE_TOP};
`;

export const ScrollBody = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  ${hideScrollbar}
`;

export const CardsWrap = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardsArea = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 max(1.25rem, var(--safe-right), env(safe-area-inset-right, 0px))
    2.5rem max(1.25rem, var(--safe-left), env(safe-area-inset-left, 0px));
`;
