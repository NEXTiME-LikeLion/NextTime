import { useCallback, useEffect, useRef, useState } from "react";

function useAsync(asyncFn, { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const asyncFnRef = useRef(asyncFn);
  asyncFnRef.current = asyncFn;

  const lastArgsRef = useRef([]);

  const execute = useCallback(async (...args) => {
    lastArgsRef.current = args;
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFnRef.current(...args);
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

  const refetch = useCallback(
    () => execute(...lastArgsRef.current),
    [execute],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, isLoading, error, execute, refetch, reset };
}

export default useAsync;
