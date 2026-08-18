import { useCallback, useEffect, useRef, useState } from "react";

function useAsync(asyncFn, { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const asyncFnRef = useRef(asyncFn);
  asyncFnRef.current = asyncFn;

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFnRef.current();
      setData(result);
      return result;
    } catch (err) {
      console.error(err);
      setData(null);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, isLoading, error, refetch: execute };
}

export default useAsync;
