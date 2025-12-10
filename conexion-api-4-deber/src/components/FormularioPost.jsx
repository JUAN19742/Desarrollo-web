import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

export default function FormularioPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', body: '', userId: '' });
  const [savedMessage, setSavedMessage] = useState('');
  const { data: postData, loading: loadingPost } = useFetch(id ? `http://localhost:3000/posts/${id}` : null, {}, [id]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(r => r.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (postData) {
      setForm({
        title: postData.title || '',
        body: postData.body || '',
        userId: postData.userId ? String(postData.userId) : '',
      });
    }
  }, [postData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const canSubmit = form.title.trim() !== '' && form.body.trim() !== '' && form.userId !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      setSavedMessage('Completa título, contenido y autor.');
      return;
    }

    const url = id ? `http://localhost:3000/posts/${id}` : 'http://localhost:3000/posts';
    const method = id ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          userId: Number(form.userId) // guardamos número si tu db espera number
        }),
      });
      if (!res.ok) throw new Error('Error en servidor');
      const json = await res.json();

      if (!id) setForm({ title: '', body: '', userId: '' });

      setSavedMessage(id ? 'Post actualizado correctamente' : 'Post creado correctamente');

      setTimeout(() => navigate('/posts'), 900);
    } catch (err) {
      setSavedMessage('Error: ' + (err.message || err));
    }
  };

  if (loadingPost) return <p>Cargando...</p>;

  return (
    <div className="container">
      <Link to="/posts">← Volver</Link>
      <h2>{id ? 'Editar post' : 'Crear post'}</h2>

      {savedMessage && <p style={{ marginTop: 8 }}>{savedMessage}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
        <label>
          Título
          <input name="title" value={form.title} onChange={handleChange} />
        </label>

        <label>
          Contenido
          <textarea name="body" rows="8" value={form.body} onChange={handleChange} />
        </label>

        <label>
          Autor
          <select name="userId" value={form.userId} onChange={handleChange}>
            <option value="">Selecciona autor</option>
            {users.map(u => <option key={u.id} value={String(u.id)}>{u.name}</option>)}
          </select>
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={!canSubmit}>{id ? 'Actualizar' : 'Crear'}</button>
          <Link to="/posts">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
