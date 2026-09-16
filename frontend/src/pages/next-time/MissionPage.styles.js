import styled from 'styled-components';

export const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-inline: 1.25rem;
`;

export const AllContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow-y: auto;
`;

export const Box = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-block: 1.25rem;
  min-height: 0;
  margin-top: 2.44rem;
`;

export const StatusLabel = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
`;

export const MissionTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;

  p {
    margin: 0;
  }
`;

export const Description = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  word-break: keep-all;

  p {
    margin: 0;
  }
`;

export const BottomArea = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  margin-bottom: 2.06rem;
  padding-inline: 0.94rem;
  padding-bottom: max(var(--safe-bottom), env(safe-area-inset-bottom, 0px));
  background: transparent;

  & > button {
    opacity: 0.92;
  }
`;

export const SkipButton = styled.button`
  width: 100%;
  height: 3.5rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
