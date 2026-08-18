import mascotLoading from "../../assets/mascot-loading.svg";
import styled from "styled-components";

function ApiStatusView({
  isLoading,
  error,
  onRetry,
  loadingTitle = "불러오는 중이에요",
  loadingDescription = "잠시만 기다려주세요.",
  errorTitle = "불러오기에 실패했어요",
  errorDescription = "일시적인 오류가 발생했어요.\n잠시 후 다시 시도해주세요.",
  children,
}) {
  if (isLoading) {
    return (
      <StatusScreen>
        <StatusContent>
          <Mascot src={mascotLoading} alt="" />
          <StatusTitle>{loadingTitle}</StatusTitle>
          <StatusDesc>{loadingDescription}</StatusDesc>
        </StatusContent>
      </StatusScreen>
    );
  }

  if (error) {
    return (
      <StatusScreen>
        <StatusContent>
          <StatusTitle>{errorTitle}</StatusTitle>
          <StatusDesc>{errorDescription}</StatusDesc>
          {onRetry && (
            <RetryButton type="button" onClick={onRetry}>
              다시 시도
            </RetryButton>
          )}
        </StatusContent>
      </StatusScreen>
    );
  }

  return children;
}

export default ApiStatusView;

const StatusScreen = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: var(--safe-top) 1.25rem var(--safe-bottom);
  background-color: ${({ theme }) => theme.colors.bg0};
`;

const StatusContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 18rem;
  text-align: center;
`;

const Mascot = styled.img`
  width: 7.5rem;
  height: auto;
  margin-bottom: 0.5rem;
  object-fit: contain;
`;

const StatusTitle = styled.h2`
  color: ${({ theme }) => theme.colors.bg1};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

const StatusDesc = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  white-space: pre-line;
`;

const RetryButton = styled.button`
  margin-top: 0.5rem;
  width: 100%;
  height: 3rem;
  border: none;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
`;
