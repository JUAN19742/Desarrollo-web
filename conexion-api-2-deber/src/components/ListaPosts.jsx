import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListaPosts.css';

const ListaPosts = () => {
 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
   
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/posts');
        if (!response.ok) {
          throw new Error('Error al obtener los posts');
        }
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Función para cambiar página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
   
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading">Cargando posts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="lista-posts-container">
      <div className="header-container">
        <h2>Lista de Posts</h2>
        
        {/* ENLACE PARA CREAR NUEVO POST - NUEVO */}
        <Link to="/crear" className="crear-nuevo-btn">
          <span className="plus-icon">+</span> Crear Nuevo Post
        </Link>
      </div>


      <div className="posts-grid">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">
                {post.body.length > 150 
                  ? `${post.body.substring(0, 150)}...` 
                  : post.body}
              </p>
              
              <div className="post-footer">
                <Link to={`/post/${post.id}`} className="ver-detalle-btn">
                  Ver detalles →
                </Link>
                <div className="post-meta">
                  <span className="user-id">Usuario: {post.userId || 1}</span>
                  <span className="post-id">ID: {post.id}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <p>No hay posts disponibles.</p>
            <Link to="/crear" className="crear-primer-btn">
              Crear el primer post
            </Link>
          </div>
        )}
      </div>

      {posts.length > postsPerPage && (
        <div className="paginacion-container">
          <div className="paginacion-info">
            Mostrando {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, posts.length)} de {posts.length} posts
          </div>
          
          <div className="paginacion-controls">
            {/* Botón Anterior */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagina-btn anterior-btn"
            >
              ← Anterior
            </button>
            
            <div className="pagina-numeros">
              {(() => {
                const pageNumbers = [];
                const maxVisiblePages = 5;
                
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      onClick={() => paginate(i)}
                      className={`pagina-numero ${currentPage === i ? 'activo' : ''}`}
                    >
                      {i}
                    </button>
                  );
                }
                return pageNumbers;
              })()}
            </div>
            
            {/* Botón Siguiente */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagina-btn siguiente-btn"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaPosts;