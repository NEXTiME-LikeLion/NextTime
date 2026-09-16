import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding-inline: 1.25rem;
  position: relative;
`;

export const IntroBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 2rem;

  font-weight: 700;
  line-height: 1.4;
`;

export const NextTime = styled.p`
  color: ${({ theme }) => theme.colors.bg0};
  font-size: 0.875rem;
`;

export const MainTitle = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
`;

export const HelperText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 400;
`;

export const ProgressBarWrap = styled.div`
  margin-bottom: 1.5rem;
`;

export const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: ${({ $bottomAreaHeight }) => $bottomAreaHeight}rem;
`;

export const Question = styled.h2`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

export const BottomArea = styled.div`
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  bottom: 0;
  padding-block: 2.5rem 2.25rem;

  background: linear-gradient(
    to bottom,
    rgba(10, 10, 20, 0) 0%,
    rgba(10, 10, 20, 0.85) 35%,
    rgba(10, 10, 20, 0.85) 100%
  );

  pointer-events: none;

  & > button {
    opacity: 0.92;
    pointer-events: auto;
  }
`;
