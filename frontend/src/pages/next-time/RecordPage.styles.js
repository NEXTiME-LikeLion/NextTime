import styled from 'styled-components';

export const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-inline: 1.25rem;
  position: relative;
`;

export const IntroBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  margin-top: 1.13rem;
  line-height: 1.4;
  word-break: keep-all;
`;

export const MainTitle = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.25rem;
  font-weight: 600;
`;

export const HelperText = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 400;
`;

export const ScrollContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  margin-top: 1.56rem;
  
`;

export const FieldGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FieldLabel = styled.h2`
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

export const OptionalLabelBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const OptionalTag = styled.span`
  color: ${({ theme }) => theme.colors.gray};
`;

export const OptionalHint = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
`;

export const BottomArea = styled.div`
  width: 100%;
  padding-top: 3.56rem;
  padding-bottom: calc(
    2.25rem + max(var(--safe-bottom), env(safe-area-inset-bottom, 0px))
  );
`;
