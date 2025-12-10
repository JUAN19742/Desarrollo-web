import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

export default function DetallePost() {
  const { id } = useParams();
  const { data: post, loading, error, refetch } = useFetch(null, {}, []);

  useEffect(() => {
    refetch(`http://localhost:3000/posts/${id}?_expand=user`);
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message || error}</p>;
  if (!post) return <p>No se encontró el post</p>;

  // si backend devolvió user expandido:
  const user = post.user;

  return (
    <div className="container">
      <Link to="/posts">← Volver al listado</Link>
      <h1>{post.title}</h1>
      <p>{post.body}</p>

      <section style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <h3>Autor</h3>
        {user ? (
          <div>
            <p><strong>{user.name}</strong></p>
            {user.email && <p>{user.email}</p>}
            {user.phone && <p>{user.phone}</p>}
            {user.website && <p><a href={`http://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></p>}
          </div>
        ) : (
          <UserFromId userId={post.userId} />
        )}
      </section>
    </div>
  );
}

function UserFromId({ userId }) {
  const { data: user, loading } = useFetch(userId ? `http://localhost:3000/users/${userId}` : null, {}, [userId]);
  if (loading) return <p>Cargando usuario...</p>;
  if (!user) return <p>Usuario no disponible</p>;
  return (
    <div>
      <p><strong>{user.name}</strong></p>
      {user.email && <p>{user.email}</p>}
    </div>
  );
}
