import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';

export default function ListaPosts() {

  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState(''); 
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const { data: posts, loading, error, refetch } = useFetch(null, {}, []); 

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(r => r.json())
      .then(setUsers)
      .catch(err => console.error('Users fetch:', err));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword.trim()), 400);
    return () => clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    const base = 'http://localhost:3000/posts';
    const params = new URLSearchParams();
    if (userFilter) params.append('userId', userFilter);
    if (debouncedKeyword) params.append('q', debouncedKeyword);
    const final = params.toString() ? `${base}?${params.toString()}` : base;
    refetch(final);
  }, [userFilter, debouncedKeyword]);

  return (
    <div className="container">
      <h2>Listado de posts</h2>

      <div className="filters" style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <select value={userFilter} onChange={e => setUserFilter(e.target.value)}>
          <option value="">Todos los usuarios</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <input
          placeholder="Buscar por palabra en título o contenido"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />

        <Link to="/posts/new" className="btn">Crear post</Link>
      </div>

      {loading && <p>Cargando posts...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message || error}</p>}

      <ul className="posts-grid" style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {posts && posts.map(p => (
          <li key={p.id} style={{ background: '#fff', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
            <Link to={`/posts/${p.id}`} style={{ textDecoration: 'none', color: '#111' }}>
              <h3>{p.title}</h3>
              <p style={{ color: '#666' }}>{p.body?.slice(0, 120)}{p.body?.length > 120 ? '...' : ''}</p>
            </Link>
            <small style={{ display: 'block', marginTop: '8px', color: '#888' }}>Autor: {p.userId ? `Usuario ${p.userId}` : 'Desconocido'}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
