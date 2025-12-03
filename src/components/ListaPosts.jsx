import { useState, useEffect } from 'react';
import { Link } from "react-router";

function ListaPosts() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // PASO 4: Implementar la llamada a la API
    const cargarPosts = async () => {
      try {
        setCargando(true);
        // Hacer fetch a https://jsonplaceholder.typicode.com/posts
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
        if (!respuesta.ok) {
          throw new Error('Error al cargar los posts');
        }
        const datos = await respuesta.json();
        setPosts(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarPosts();
  }, []);

  if (cargando) {
    return (
      <div className="cargando">
        <div className="spinner"></div>
        <p>Cargando posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>❌ Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>📝 Lista de Posts</h2>
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            {/* PASO 5: Agregar Link de React Router para navegar al detalle */}
            <Link to={`/posts/${post.id}`} className="post-link">Ver Detalle</Link>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaPosts;
