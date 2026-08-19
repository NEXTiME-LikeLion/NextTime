import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNextTime } from "../contexts/NextTimeContext";
import useAsync from "./useAsync";
import { rewindNextTimeSession } from "../api/nextTime";

function useRewindNextTimeSession({ isBusy = false } = {}) {
  const navigate = useNavigate();
  const { session, sessionId, applyRewind } = useNextTime();
  const { isLoading, error, execute, refetch } = useAsync(
    rewindNextTimeSession,
    { immediate: false },
  );
  const hasStartedRef = useRef(false);

  const goToContext = useCallback(
    (rewoundSession) => {
      applyRewind(rewoundSession);
      navigate("/next-time/context", { replace: true });
    },
    [applyRewind, navigate],
  );

  const rewind = useCallback(async () => {
    if (hasStartedRef.current || isLoading || isBusy) return;

    if (!sessionId) {
      console.error("세션 ID가 없어 세션을 초기화할 수 없습니다.");
      return;
    }

    hasStartedRef.current = true;

    if (session?.status === "CREATED") {
      console.log("세션이 이미 CREATED 상태라 초기화를 건너뜁니다.", {
        sessionId,
        status: session.status,
        session,
      });
      goToContext(session);
      return;
    }

    console.log("세션을 초기화합니다.", { sessionId, status: session?.status });
    const result = await execute(sessionId);
    if (!result) {
      console.error("세션 초기화에 실패했습니다.");
      return;
    }

    console.log("세션을 초기화했습니다.", {
      sessionId: result.sessionId,
      status: result.status,
      result,
    });
    goToContext(result);
  }, [execute, goToContext, isBusy, isLoading, session, sessionId]);

  const retry = useCallback(async () => {
    if (!sessionId) return;

    hasStartedRef.current = true;
    console.log("세션 초기화를 다시 시도합니다.", { sessionId });
    const result = await refetch();
    if (!result) {
      console.error("세션 초기화에 실패했습니다.");
      return;
    }

    console.log("세션을 초기화했습니다.", {
      sessionId: result.sessionId,
      status: result.status,
      result,
    });
    goToContext(result);
  }, [goToContext, refetch, sessionId]);

  return { rewind, retry, isLoading, error, hasStartedRef };
}

export default useRewindNextTimeSession;
