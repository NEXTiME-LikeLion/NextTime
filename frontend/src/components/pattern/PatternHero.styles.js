import styled from "styled-components";

export const Hero = styled.header`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 max(1.25rem, var(--safe-right), env(safe-area-inset-right, 0px))
    1.5rem max(1.25rem, var(--safe-left), env(safe-area-inset-left, 0px));
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.bg_black};
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.4;
`;

export const Mascot = styled.img`
  width: 5.375rem;
  height: auto;
  max-height: 9.875rem;
  aspect-ratio: 86 / 158;
  margin-top: 0.25rem;
  object-fit: contain;
  object-position: center bottom;
  flex-shrink: 0;
`;

export const WeeklyMetric = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 10.75rem;
  height: 2.375rem;
  margin-top: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 1.375rem;
  background: rgba(255, 255, 255, 0.84);
  overflow: visible;

  &::before {
    content: "";
    position: absolute;
    top: -0.375rem;
    left: 50%;
    width: 0.776rem;
    height: 0.5rem;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.84);
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
`;

export const WeeklyLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  white-space: nowrap;
`;

export const WeeklyValue = styled.span`
  color: #00b96b;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
`;

export const PreparingCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 20.625rem;
  min-height: 9.125rem;
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 1.375rem;
  background: ${({ theme }) => theme.colors.white};
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    top: -0.5rem;
    left: 50%;
    width: 1.22rem;
    height: 0.672rem;
    transform: translateX(-50%);
    background: ${({ theme }) => theme.colors.white};
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
`;

export const PreparingMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
`;

export const ProgressBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 0.375rem;
  width: 100%;
  max-width: 17.5rem;
`;

export const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 0.5rem;
  overflow: hidden;
  border-radius: 6.25rem;
  background: #eef7f3;
  flex-shrink: 0;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $ratio }) => `${Math.min(Math.max($ratio, 0), 1) * 100}%`};
  border-radius: ${({ $ratio }) =>
    $ratio >= 1 ? "6.25rem" : "6.25rem 0 0 6.25rem"};
  background: ${({ theme }) => theme.colors.primary};
`;

export const ProgressText = styled.p`
  display: block;
  width: 100%;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: right;
`;
