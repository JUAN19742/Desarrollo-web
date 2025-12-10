import { useState, useEffect, useRef } from 'react';

const cache = new Map();

export const useFetch = (url, options = {}, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchData = async (overrideUrl) => {
    const finalUrl = overrideUrl || url;
    if (!finalUrl) return;

    setLoading(true);
    setError(null);

    const key = finalUrl + '|' + JSON.stringify(options);
    if (cache.has(key)) {
      setData(cache.get(key));
      setLoading(false);
      return;
    }

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      const res = await fetch(finalUrl, { ...options, signal });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      cache.set(key, json);
      setData(json);
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };

  }, deps); 

  const refetch = (overrideUrl) => fetchData(overrideUrl);

  return { data, loading, error, refetch };
};

export default useFetch;
