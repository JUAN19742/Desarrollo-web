import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router";
import { useFetch } from '../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';

function DetallePost() {
  // const [post, setPost] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  // const [cargando, setCargando] = useState(true);
  // const [error, setError] = useState(null);

  // PASO 6: Obtener el ID del post desde los parámetros de la URL
  // TODO: Usar useParams de react-router-dom
  const { id: postId } = useParams();
  const navigate = useNavigate();
  <button 
  className="boton-volver" 
  onClick={() => navigate('/')}
  >
    ← Volver a la lista
  </button>

  const { data: post, loading: cargando, error } = useFetch(`/api/posts/${postId}`);


useEffect(() => {
  const cargarDetalles = async () => {
    try {
      setCargando(true);
      
      // Cargar el post
      const respuestaPost = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      
      if (!respuestaPost.ok) {
        throw new Error('Post no encontrado');
      }
      
      const datosPost = await respuestaPost.json();
      setPost(datosPost);
      
      // Cargar el usuario del post
      const respuestaUsuario = await fetch(
        `https://jsonplaceholder.typicode.com/users/${datosPost.userId}`
      );
      
      if (!respuestaUsuario.ok) {
        throw new Error('Usuario no encontrado');
      }
      
      const datosUsuario = await respuestaUsuario.json();
      setUsuario(datosUsuario);
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  if (id) {
    cargarDetalles();
  }
}, [id]);

  if (cargando) {
    return (
      <div className="cargando">
        <div className="spinner"></div>
        <p>Cargando detalles...</p>
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

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este post?')) {
      return;
    }

    try {
      setEliminando(true);
      const respuesta = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo eliminar el post');
      }

      console.log('Post eliminado:', postId);
      // Redirigir a la lista de posts
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el post: ' + error.message);
    } finally {
      setEliminando(false);
    }
  };

  if (!post) {
    return <div className="error">Post no encontrado</div>;
  }

  return (
    <div className="detalle-container">
      {/* PASO 9: Agregar Link/botón para volver a la lista */}
      {/* <button className="boton-volver" href="/">← Volver a la lista</button> */}
      <Link to="/" className="boton-volver">← Volver a la lista</Link>

      <div className="detalle-post">
        <h2>{post.title}</h2>
        
        {usuario && (
          <div className="autor">
            <strong>Autor:</strong> {usuario.name} ({usuario.email})
          </div>
        )}
        
        <div className="contenido">
          <p>{post.body}</p>
        </div>

        <div className="acciones">
          <Link to={`/posts/${postId}/edit`} className="btn-editar">
            ✏️ Editar
          </Link>
          <button 
            onClick={handleEliminar} 
            className="btn-eliminar"
            disabled={eliminando}
          >
            {eliminando ? 'Eliminando...' : '🗑️ Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetallePost;
