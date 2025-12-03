// src/hooks/usePosts.js
import useFetch from './useFetch';

// Cambia esta URL por la del proyecto de la clase si la tienes, por ejemplo '/api/posts' o similar.
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export default function usePosts() {
  const { data, loading, error, refetch } = useFetch(POSTS_URL, {}, { immediate: true });

  // data puede ser null o array
  return {
    posts: data || [],
    loading,
    error,
    refetch
  };
}
