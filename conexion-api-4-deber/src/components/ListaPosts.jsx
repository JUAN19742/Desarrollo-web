import { useState, useEffect } from 'react';
import { Link } from "react-router";
import { Link } from 'react-router-dom';

function ListaPosts() {
  const [pagina, setPagina] = useState(1);
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [limite, setLimite] = useState(20);

  useEffect(() => {
    const cargarPosts = async () => {
      try {
        setCargando(true);
        const respuesta = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_limit=${limite}`
        );
        
        if (!respuesta.ok) {
          throw new Error('Error al cargar los posts');
        }
        
        const datos = await respuesta.json();
        setPosts(datos);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarPosts();
  }, [pagina, limite]);

  if (cargando) {
    return (
      <div className="posts-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="post-card" style={{ opacity: 0.5 }}>
            <div style={{ background: '#ddd', height: '20px', marginBottom: '10px' }}></div>
            <div style={{ background: '#ddd', height: '60px' }}></div>
          </div>
        ))}
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
  
  <input
    type="text"
    placeholder="🔍 Buscar posts..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    style={{
      width: '100%',
      padding: '1rem',
      fontSize: '1rem',
      border: '2px solid #ddd',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}
  />
  return (
    <div>
      <h2>📝 Lista de Posts</h2>
      <div className="posts-grid">
        {postsFiltrados.map(post => (
          <Link 
            to={`/post/${post.id}`} 
            key={post.id} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="post-card">
              <h3>{post.title}</h3>
              <p>{post.body.substring(0, 100)}...</p>
            </div>
          </Link>
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
  )
  
}



const [busqueda, setBusqueda] = useState('');

const postsFiltrados = posts.filter(post =>
  post.title.toLowerCase().includes(busqueda.toLowerCase()) ||
  post.body.toLowerCase().includes(busqueda.toLowerCase())
);

export default ListaPosts;
