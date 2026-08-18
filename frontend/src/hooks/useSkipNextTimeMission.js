import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNextTime } from "../contexts/NextTimeContext";
import useAsync from "./useAsync";
import { skipNextTimeMission } from "../api/nextTime";

function useSkipNextTimeMission({ isBusy = false } = {}) {
  const navigate = useNavigate();
  const { session, sessionId, resetFlow } = useNextTime();
  const { isLoading, error, execute, refetch } = useAsync(skipNextTimeMission, {
    immediate: false,
  });

  const goHome = useCallback(() => {
    resetFlow();
    navigate("/main", { replace: true });
  }, [navigate, resetFlow]);

  const skip = useCallback(async () => {
    if (isLoading || isBusy) return;

    if (!sessionId) {
      console.error("세션 ID가 없어 미션을 건너뛸 수 없습니다.");
      return;
    }

    if (session?.status === "CANCELLED") {
      console.log("세션이 이미 건너뛴 상태라 홈으로 이동합니다.", {
        sessionId,
        status: session.status,
        skippedAt: session.skippedAt,
        session,
      });
      goHome();
      return;
    }

    console.log("미션을 건너뜁니다.", { sessionId, status: session?.status });
    const result = await execute(sessionId);
    if (!result) {
      console.error("미션 건너뛰기에 실패했습니다.");
      return;
    }

    console.log("미션을 건너뛰었습니다.", {
      sessionId: result.sessionId,
      status: result.status,
      mission: result.mission,
      skippedAt: result.skippedAt,
      result,
    });
    goHome();
  }, [execute, goHome, isBusy, isLoading, session, sessionId]);

  const retry = useCallback(async () => {
    console.log("미션 건너뛰기를 다시 시도합니다.", { sessionId });
    const result = await refetch();
    if (!result) {
      console.error("미션 건너뛰기에 실패했습니다.");
      return;
    }

    console.log("미션을 건너뛰었습니다.", {
      sessionId: result.sessionId,
      status: result.status,
      mission: result.mission,
      skippedAt: result.skippedAt,
      result,
    });
    goHome();
  }, [goHome, refetch, sessionId]);

  return { skip, retry, isLoading, error };
}

export default useSkipNextTimeMission;
