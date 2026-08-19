import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiStatusView from "../../components/common/ApiStatusView";
import useAsync from "../../hooks/useAsync";
import {
  getNextTimePathByStatus,
  startFreshNextTimeSession,
} from "../../api/nextTime";
import { debugError, debugLog } from "../../api/debugLog";

function NextTimeEntryPage() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useAsync(
    startFreshNextTimeSession,
  );

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
    <ApiStatusView
      variant="dark"
      isLoading={isLoading || Boolean(data?.sessionId)}
      error={error}
      onRetry={refetch}
      loadingTitle="NEXT TIME을 시작하는 중이에요"
      errorTitle="NEXT TIME을 시작하지 못했어요"
    />
  );
}

export default NextTimeEntryPage;
