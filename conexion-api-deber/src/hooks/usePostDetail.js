// src/hooks/usePostDetail.js
import { useMemo } from 'react';
import useFetch from './useFetch';

export default function usePostDetail(id) {
  // Si no hay id no hacemos fetch
  const url = useMemo(() => (id ? `https://jsonplaceholder.typicode.com/posts/${id}` : null), [id]);
  const { data, loading, error, refetch } = useFetch(url, {}, { immediate: Boolean(id) });

  return {
    post: data,
    loading,
    error,
    refetch
  };
}
