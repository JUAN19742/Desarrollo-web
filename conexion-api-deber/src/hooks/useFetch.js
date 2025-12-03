// src/hooks/useFetch.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useFetch
 * Abstracción simple para realizar peticiones fetch con estado de carga, datos, error y refetch.
 * Uso:
 *   const { data, loading, error, refetch } = useFetch(url, options, { immediate: true });
 */
export default function useFetch(url, options = {}, config = { immediate: true }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(config.immediate && url));
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState(0); // para forzar refetch
  const isMounted = useRef(true);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (providedUrl = url) => {
    if (!providedUrl) return;
    // abort previo
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(providedUrl, { ...options, signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const json = await response.json();
      if (isMounted.current) setData(json);
    } catch (err) {
      if (err.name === 'AbortError') {
        // petición abortada: no hacer nada
        return;
      }
      if (isMounted.current) setError(err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    isMounted.current = true;
    if (config.immediate && url) {
      fetchData();
    }
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchData, counter]);

  // refetch (llama a fetchData de nuevo)
  const refetch = (newUrl) => {
    if (newUrl) {
      // si se pasa nueva URL, actualizamos y forzamos fetch
      fetchData(newUrl);
    } else {
      // forzar efecto para re-ejecutar fetch
      setCounter((c) => c + 1);
    }
  };

  return { data, loading, error, refetch };
}
