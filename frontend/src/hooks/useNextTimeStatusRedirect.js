import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNextTime } from "../contexts/NextTimeContext";
import {
  getNextTimePathByStatus,
  isNextTimeStatusAfter,
} from "../api/nextTime";

function useNextTimeStatusRedirect(pageStatus) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { session } = useNextTime();
  const sessionStatus = session?.status;

  useEffect(() => {
    if (!sessionStatus || !isNextTimeStatusAfter(sessionStatus, pageStatus)) {
      return;
    }

    const targetPath = getNextTimePathByStatus(sessionStatus);
    if (pathname === targetPath) return;

    console.log("진행 중인 세션 상태에 맞는 화면으로 이동합니다.", {
      sessionStatus,
      from: pathname,
      to: targetPath,
    });
    navigate(targetPath, { replace: true });
  }, [navigate, pageStatus, pathname, sessionStatus]);
}

export default useNextTimeStatusRedirect;
