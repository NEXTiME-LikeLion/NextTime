import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAsync from "./useAsync";
import { resolveNextTimeSession } from "../api/nextTime";

function useStartNextTime(activeNextTimeSession) {
  const navigate = useNavigate();
  const { isLoading, error, execute } = useAsync(resolveNextTimeSession, {
    immediate: false,
  });

  const start = useCallback(async () => {
    if (activeNextTimeSession?.sessionId) {
      console.log("이미 진행 중인 세션이 있습니다. /next-time으로 이동합니다.", {
        sessionId: activeNextTimeSession.sessionId,
        status: activeNextTimeSession.status,
        session: activeNextTimeSession,
      });
      navigate("/next-time", { state: { session: activeNextTimeSession } });
      return;
    }

    console.log("기존에 존재하는 세션이 없습니다. 새 세션 추가합니다.");
    const session = await execute(activeNextTimeSession);
    if (!session) return;

    console.log("새 세션을 생성했습니다.", {
      sessionId: session.sessionId,
      status: session.status,
      session,
    });
    navigate("/next-time", { state: { session } });
  }, [activeNextTimeSession, execute, navigate]);

  return { start, isLoading, error, retry: start };
}

export default useStartNextTime;
