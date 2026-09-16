import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAsync from "../../hooks/useAsync";
import {
  getNextTimePathByStatus,
  startFreshNextTimeSession,
} from "../../api/nextTime";
import { debugError, debugLog } from "../../api/debugLog";

function NextTimeEntryPage() {
  const navigate = useNavigate();
  const { data, error, refetch } = useAsync(startFreshNextTimeSession);

  useEffect(() => {
    if (!data?.sessionId) return;

    const path = getNextTimePathByStatus(data.status);
    debugLog("IoT", "새 NEXT TIME 세션으로 이동합니다.", {
      sessionId: data.sessionId,
      status: data.status,
      path,
    });
    navigate(path, { replace: true, state: { session: data } });
  }, [data, navigate]);

  useEffect(() => {
    if (!error) return;
    debugError("IoT", "NEXT TIME 세션 시작 실패", error);
  }, [error]);

  return (
    <Screen>
      {error ? (
        <RetryButton type="button" onClick={refetch}>
          다시 시도
        </RetryButton>
      ) : null}
    </Screen>
  );
}

export default NextTimeEntryPage;

const Screen = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 0;
  background: ${({ theme }) => theme.colors.bg_black};
  padding-top: max(var(--safe-top), env(safe-area-inset-top, 0px));
  padding-bottom: max(var(--safe-bottom), env(safe-area-inset-bottom, 0px));
`;

const RetryButton = styled.button`
  width: min(18rem, calc(100% - 2.5rem));
  height: 3rem;
  border: none;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
`;
