import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CrearPost.css';

const CrearPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: 1
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error cuando empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'El contenido es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          id: Date.now()
        })
      });
      
      if (response.ok) {
        // 1. Limpiar los campos
        setFormData({ title: '', body: '', userId: 1 });
        
        // 2. Mostrar mensaje de éxito
        setMessage('¡Post creado exitosamente!');
        setErrors({});
        
        // 3. Opcional: Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al crear el post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="crear-post-container">
      {/* 1. LINK PARA REGRESAR AL LISTADO */}
      <Link to="/" className="back-link">
        ← Volver al listado de posts
      </Link>
      
      <h2>Crear Nuevo Post</h2>
      
      {/* 4. MENSAJE DE ÉXITO */}
      {message && (
        <div className="success-message">
          <p>{message}</p>
          <p>Redirigiendo al listado en 2 segundos...</p>
          <Link to="/" className="view-posts-btn">
            Ver todos los posts ahora
          </Link>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error-input' : ''}
            placeholder="Escribe el título aquí"
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="body">Contenido:</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows="6"
            className={errors.body ? 'error-input' : ''}
            placeholder="Escribe el contenido aquí"
          />
          {errors.body && <span className="error-text">{errors.body}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="userId">ID de Usuario:</label>
          <input
            type="number"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            min="1"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando...' : 'Crear Post'}
        </button>
      </form>
    </div>
  );
};

export default CrearPost;