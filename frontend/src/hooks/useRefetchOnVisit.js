import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function useRefetchOnVisit(refetch) {
  const { key } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    refetch();
  }, [key, refetch]);

  useEffect(() => {
    const refetchIfVisible = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };

    const onPageShow = (event) => {
      if (event.persisted) {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", refetchIfVisible);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", refetchIfVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [refetch]);
}

export default useRefetchOnVisit;
