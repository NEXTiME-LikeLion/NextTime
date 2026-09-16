
import styled, { keyframes, css } from "styled-components";
const MIN_BAR_PERCENT = 38;
const MIN_LOADING_MS = 5000;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const runMotion = keyframes`
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(0.5rem);
  }
`;

export const fillMin = keyframes`
  from {
    width: 0%;
  }
  to {
    width: ${MIN_BAR_PERCENT}%;
  }
`;

export const fillExtra = keyframes`
  from {
    width: ${MIN_BAR_PERCENT}%;
  }
  to {
    width: 90%;
  }
`;

export const dotMin = keyframes`
  from {
    left: 0;
  }
  to {
    left: calc(${MIN_BAR_PERCENT}% - 0.1875rem);
  }
`;

export const dotExtra = keyframes`
  from {
    left: calc(${MIN_BAR_PERCENT}% - 0.1875rem);
  }
  to {
    left: calc(90% - 0.1875rem);
  }
`;

export const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-inline: 1.25rem;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding-block: 1.25rem;
  padding-bottom: ${({ $bottomAreaHeight }) => $bottomAreaHeight ?? 0}rem;
  text-align: center;
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  word-break: keep-all;
`;

export const FadeLine = styled.p`
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`;

export const HighlightLine = styled(FadeLine)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const BodyLine = styled(FadeLine)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
`;

export const BoldLine = styled(FadeLine)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
`;

export const MascotWrap = styled.div`
  opacity: 0;
  animation:
    ${fadeInUp} 0.6s ease forwards,
    ${runMotion} 0.6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => `${$delay}s`},
    ${({ $delay }) => `${$delay + 0.6}s`};
`;

export const ClosingLine = styled(FadeLine)`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const BottomArea = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3.56rem;
  padding-bottom: max(var(--safe-bottom), env(safe-area-inset-bottom, 0px));
`;

export const LoadingBarTrack = styled.div`
  position: relative;
  width: 100%;
  height: 0.125rem;
`;

export const LoadingBarBg = styled.div`
  position: absolute;
  top: 0.125rem;
  left: 0;
  width: 100%;
  height: 0.125rem;
  border-radius: 6.25rem;
  background: rgba(178, 178, 178, 0.8);
`;

export const LoadingBarFill = styled.div`
  position: absolute;
  top: 0.125rem;
  left: 0;
  height: 0.125rem;
  border-radius: 6.25rem;
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ $stage }) => ($stage === "extra" ? `${MIN_BAR_PERCENT}%` : "0")};
  animation: ${({ $stage }) =>
    $stage === "extra"
      ? css`
          ${fillExtra} 20s linear forwards
        `
      : css`
          ${fillMin} ${MIN_LOADING_MS}ms ease-out forwards
        `};
`;

export const LoadingBarDot = styled.div`
  position: absolute;
  top: 0;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  left: ${({ $stage }) =>
    $stage === "extra" ? `calc(${MIN_BAR_PERCENT}% - 0.1875rem)` : "0"};
  animation: ${({ $stage }) =>
    $stage === "extra"
      ? css`
          ${dotExtra} 20s linear forwards
        `
      : css`
          ${dotMin} ${MIN_LOADING_MS}ms ease-out forwards
        `};
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.light_gray};
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
`;
