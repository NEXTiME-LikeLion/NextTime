import mascotLoading from "../../assets/mascot-loading.svg";
import styled from "styled-components";
import { getApiErrorMessage } from "../../api/getApiErrorMessage";

function ApiStatusView({
  isLoading,
  error,
  onRetry,
  variant = "page",
  loadingTitle = "불러오는 중이에요",
  loadingDescription = "잠시만 기다려주세요.",
  errorTitle = "불러오기에 실패했어요",
  errorDescription,
  children,
}) {
  const resolvedErrorDescription =
    errorDescription ?? getApiErrorMessage(error);

  if (isLoading) {
    return (
      <StatusScreen $variant={variant}>
        <StatusContent>
          <Mascot src={mascotLoading} alt="" $variant={variant} />
          <StatusTitle $variant={variant}>{loadingTitle}</StatusTitle>
          <StatusDesc $variant={variant}>{loadingDescription}</StatusDesc>
        </StatusContent>
      </StatusScreen>
    );
  }

  if (error) {
    return (
      <StatusScreen $variant={variant}>
        <StatusContent>
          <StatusTitle $variant={variant}>{errorTitle}</StatusTitle>
          <StatusDesc $variant={variant}>{resolvedErrorDescription}</StatusDesc>
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
  min-height: ${({ $variant }) => ($variant === "embed" ? "12rem" : "100%")};
  padding: ${({ $variant }) =>
    $variant === "embed" ? "0.5rem 0" : "0 1.25rem"};
  padding-top: ${({ $variant }) =>
    $variant === "embed"
      ? "0.5rem"
      : "max(var(--safe-top), env(safe-area-inset-top, 0px))"};
  padding-bottom: ${({ $variant }) =>
    $variant === "embed"
      ? "0.5rem"
      : "max(var(--safe-bottom), env(safe-area-inset-bottom, 0px))"};
  background-color: ${({ $variant, theme }) => {
    if ($variant === "embed") return "transparent";
    if ($variant === "dark") return theme.colors.bg_black;
    return theme.colors.bg0;
  }};
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
  width: ${({ $variant }) => ($variant === "embed" ? "5rem" : "7.5rem")};
  height: auto;
  margin-bottom: 0.5rem;
  object-fit: contain;
`;

const StatusTitle = styled.h2`
  color: ${({ theme, $variant }) =>
    $variant === "dark" ? theme.colors.white : theme.colors.bg1};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4;
`;

const StatusDesc = styled.p`
  color: ${({ theme, $variant }) =>
    $variant === "dark" ? theme.colors.light_gray : theme.colors.gray};
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
