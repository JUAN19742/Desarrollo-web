import { useState, useEffect } from 'react';
import { Link } from "react-router";

function ListaPosts() {
  const [pagina, setPagina] = useState(1);
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const limite = 4;

  useEffect(() => {
    const cargarPosts = async () => {
      try {
        setCargando(true);
        setError(null);
        const url = `/api/posts?_page=${pagina}&_per_page=${limite}`;
        console.log('Página:', pagina);
        console.log('URL completa:', url);
        const respuesta = await fetch(url);
        console.log('Respuesta recibida, status:', respuesta.status);
        if (!respuesta.ok) {
          throw new Error(`Error al cargar posts: ${respuesta.status}`);
        }
        const datos = await respuesta.json();
        console.log('Datos recibidos:', datos);
        // Con _per_page, json-server devuelve { data: [...], first: ..., last: ..., next: ..., prev: ... }
        const posts = Array.isArray(datos) ? datos : (datos.data || []);
        console.log('Cantidad de posts:', posts.length);
        console.log('IDs de posts:', posts.map(p => p.id));
        setPosts(posts);
      } catch (err) {
        console.error('Error en fetch:', err);
        setError(err.message);
        setPosts([]);
      } finally {
        setCargando(false);
      }
    };

    cargarPosts();
  }, [pagina, limite]);

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
      
      {/* Controles de paginación */}
      <div className="paginacion">
        <button 
          onClick={() => {
            console.log('Click en Anterior, página actual:', pagina);
            setPagina(p => {
              const nueva = Math.max(1, p - 1);
              console.log('Nueva página:', nueva);
              return nueva;
            });
          }}
          disabled={pagina === 1}
          className="btn-paginacion"
        >
          ← Anterior
        </button>
        <span className="pagina-actual">Página {pagina}</span>
        <button 
          onClick={() => {
            console.log('Click en Siguiente, página actual:', pagina);
            setPagina(p => {
              const nueva = p + 1;
              console.log('Nueva página:', nueva);
              return nueva;
            });
          }}
          disabled={posts.length < limite}
          className="btn-paginacion"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export default ListaPosts;
