import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNextTime } from "../contexts/NextTimeContext";
import useAsync from "./useAsync";
import {
  isNextTimeRecordableStatus,
  skipNextTimeMission,
} from "../api/nextTime";

function useSkipNextTimeMission({ isBusy = false } = {}) {
  const navigate = useNavigate();
  const { session, sessionId, setSession } = useNextTime();
  const { isLoading, error, execute, refetch } = useAsync(skipNextTimeMission, {
    immediate: false,
  });

  const goToRecord = useCallback(
    (skippedSession) => {
      if (skippedSession) {
        setSession((prev) => ({ ...(prev ?? {}), ...skippedSession }));
      }
      navigate("/next-time/record", { replace: true });
    },
    [navigate, setSession],
  );

  const skip = useCallback(async () => {
    if (isLoading || isBusy) return;

    if (!sessionId) {
      console.error("세션 ID가 없어 미션을 건너뛸 수 없습니다.");
      return;
    }

    if (isNextTimeRecordableStatus(session?.status)) {
      console.log("세션이 이미 기록 가능한 상태라 건너뛰기를 다시 요청하지 않습니다.", {
        sessionId,
        status: session.status,
        skippedAt: session.skippedAt,
        session,
      });
      goToRecord(session);
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
    goToRecord(result);
  }, [execute, goToRecord, isBusy, isLoading, session, sessionId]);

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
    goToRecord(result);
  }, [goToRecord, refetch, sessionId]);

  return { skip, retry, isLoading, error };
}

export default useSkipNextTimeMission;
