import { useEffect, useState } from 'react';

export function useMultipleData(
  dataFetchers: { [key: string]: () => Promise<any> },
  _dependencies: any[],
  options?: { useMockFallback?: boolean; mockDataFn?: () => any }
) {
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const results: { [key: string]: any } = {};

      for (const [key, fetcher] of Object.entries(dataFetchers)) {
        try {
          results[key] = await fetcher();
        } catch (err) {
          if (options?.useMockFallback && options.mockDataFn) {
            const mockData = options.mockDataFn();
            results[key] = mockData[key] || null;
          } else {
            throw err;
          }
        }
      }

      setData(results);
      setError(null);
    } catch (err) {
      if (options?.useMockFallback && options.mockDataFn) {
        const mockData = options.mockDataFn();
        setData(mockData);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, _dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
