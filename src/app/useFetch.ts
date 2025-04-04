
import { useState, useEffect, useCallback, useMemo } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T = any>(url: string, options: RequestInit = {}): UseFetchResult<T> {
  // Memoize the options to prevent re-creation on each render.
  const stableOptions = useMemo(() => options, [JSON.stringify(options)]);
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    console.log("Fetching data from:", url);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, stableOptions);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const json = await response.json();
      console.log("Fetched data:", json);
      setData(json);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, stableOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}


export default useFetch;
