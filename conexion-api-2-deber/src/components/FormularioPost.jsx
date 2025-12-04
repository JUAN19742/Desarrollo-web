import {useState} from 'react';

function FormularioPost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const nuevoPost = {
      title,
      body,
      userId: 1 // Asignar un userId fijo para este ejemplo
    };

    try {
      const respuesta = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoPost)
      });

      if (!respuesta.ok) {
        throw new Error('Error al crear el post');
      }

      const datos = await respuesta.json();
      console.log('Post creado:', datos);
      // Aquí podrías redirigir o actualizar la lista de posts

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h2>Crear Nuevo Post</h2>
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contenido:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">Crear Post</button>
    </form>
  );
}

export default FormularioPost;