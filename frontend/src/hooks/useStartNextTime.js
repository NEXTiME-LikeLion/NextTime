import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAsync from "./useAsync";
import {
  getNextTimePathByStatus,
  resolveNextTimeSession,
} from "../api/nextTime";

function useStartNextTime(activeNextTimeSession) {
  const navigate = useNavigate();
  const { isLoading, error, execute } = useAsync(resolveNextTimeSession, {
    immediate: false,
  });

  const goToSession = useCallback(
    (session) => {
      const path = getNextTimePathByStatus(session?.status);
      console.log("NEXT TIME 세션 화면으로 이동합니다.", {
        sessionId: session?.sessionId,
        status: session?.status,
        path,
        session,
      });
      navigate(path, { state: { session } });
    },
    [navigate],
  );

  const start = useCallback(async () => {
    if (activeNextTimeSession?.sessionId) {
      console.log("이미 진행 중인 세션이 있습니다. 이어서 이동합니다.", {
        sessionId: activeNextTimeSession.sessionId,
        status: activeNextTimeSession.status,
        session: activeNextTimeSession,
      });
      goToSession(activeNextTimeSession);
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
    goToSession(session);
  }, [activeNextTimeSession, execute, goToSession]);

  return { start, isLoading, error, retry: start };
}

export default useStartNextTime;
