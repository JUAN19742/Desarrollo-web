# 📝 Guía Paso a Paso: App de Posts con Detalle

## Objetivo
Crear una aplicación React que liste posts desde JSONPlaceholder API y muestre sus detalles al hacer clic, incluyendo información del autor.

---

## 🚀 PASO 1: Instalar React Router

React Router nos permite crear rutas en nuestra aplicación para navegar entre diferentes vistas.

### Comando a ejecutar:
```bash
npm install react-router-dom
```

### ✅ Verificación:
- Revisar que `react-router-dom` aparezca en `package.json` bajo `dependencies`

---

## 📁 PASO 2: Configurar las rutas en App.jsx

Vamos a configurar el sistema de rutas para que tengamos:
- Ruta `/` → Lista de posts
- Ruta `/post/:id` → Detalle de un post específico

### Código a agregar en `App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListaPosts from './components/ListaPosts';
import DetallePost from './components/DetallePost';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <h1>📝 App de Posts</h1>
          <p>Aplicación para visualizar posts y sus detalles</p>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<ListaPosts />} />
            <Route path="/post/:id" element={<DetallePost />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### 📝 Explicación:
- `BrowserRouter`: Envuelve toda la app para habilitar el routing
- `Routes`: Contenedor de todas las rutas
- `Route`: Define cada ruta individual
  - `path="/"`: Ruta raíz (página principal)
  - `path="/post/:id"`: Ruta dinámica (`:id` es un parámetro)
  - `element`: Componente que se renderiza en esa ruta

### ✅ Verificación:
- La app debe cargar sin errores
- Navegar a `http://localhost:5173/` debe mostrar "Lista de Posts"

---

## 🔌 PASO 3: Implementar la carga de posts en ListaPosts.jsx

Vamos a consumir la API para obtener todos los posts.

### Código a completar en `ListaPosts.jsx`:

Encontrar el comentario `// TODO: Hacer fetch` y reemplazar con:

```jsx
useEffect(() => {
  const cargarPosts = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts');
      
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
}, []);
```

### 📝 Explicación:
- `useEffect`: Se ejecuta cuando el componente se monta
- `async/await`: Manejo moderno de promesas
- `setCargando(true)`: Muestra el spinner
- `fetch()`: Hace la petición HTTP GET a la API
- `respuesta.ok`: Verifica si la respuesta fue exitosa (status 200-299)
- `respuesta.json()`: Convierte la respuesta a objeto JavaScript
- `finally`: Se ejecuta siempre, sea éxito o error

### ✅ Verificación:
- Debe aparecer un spinner inicialmente
- Luego debe mostrarse una cuadrícula con los posts
- Cada post debe mostrar título y parte del contenido

---

## 🔗 PASO 4: Agregar navegación a los detalles

Vamos a hacer que al hacer clic en un post, navegue a su página de detalle.

### Código a agregar en `ListaPosts.jsx`:

Primero, importar `Link` al inicio del archivo:
```jsx
import { Link } from 'react-router-dom';
```

Luego, envolver el contenido del post con un `Link`:

```jsx
<div className="posts-grid">
  {posts.map(post => (
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
```

### 📝 Explicación:
- `Link`: Componente de React Router para navegación SPA (sin recargar)
- `to={`/post/${post.id}`}`: URL dinámica usando template literals
- `style`: Elimina el subrayado y color predeterminado del enlace

### ✅ Verificación:
- Al hacer clic en un post, la URL debe cambiar a `/post/1`, `/post/2`, etc.
- Debe mostrarse el componente `DetallePost`

---

## 📄 PASO 5: Obtener el ID del post desde la URL

En `DetallePost.jsx`, necesitamos acceder al parámetro `id` de la URL.

### Código a agregar en `DetallePost.jsx`:

Importar `useParams`:
```jsx
import { useParams } from 'react-router-dom';
```

Dentro del componente, reemplazar:
```jsx
const postId = null; // Placeholder
```

Con:
```jsx
const { id } = useParams();
```

### 📝 Explicación:
- `useParams()`: Hook que retorna un objeto con los parámetros de la URL
- `{ id }`: Destructuring para extraer el parámetro `id`
- Este `id` corresponde al `:id` definido en la ruta `/post/:id`

### ✅ Verificación:
- Agregar `console.log('ID del post:', id)` para verificar
- Debe mostrar el número del post en la consola

---

## 🔄 PASO 6: Cargar datos del post y del usuario

Vamos a hacer dos llamadas a la API: una para el post y otra para el usuario.

### Código a completar en `DetallePost.jsx`:

```jsx
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
```

### 📝 Explicación:
- Hacemos dos `fetch` secuenciales
- Primero obtenemos el post usando el `id` de la URL
- Luego usamos `datosPost.userId` para obtener el autor
- `if (id)`: Solo ejecuta si hay un ID válido
- `[id]`: El efecto se re-ejecuta si el ID cambia

### ✅ Verificación:
- Debe mostrarse el título completo del post
- Debe aparecer el nombre y email del autor
- Debe mostrarse el contenido completo del post

---

## ↩️ PASO 7: Agregar botón para volver

Agregar funcionalidad al botón "Volver a la lista".

### Código a agregar en `DetallePost.jsx`:

Importar `useNavigate`:
```jsx
import { useParams, useNavigate } from 'react-router-dom';
```

Dentro del componente:
```jsx
const { id } = useParams();
const navigate = useNavigate();
```

Actualizar el botón:
```jsx
<button 
  className="boton-volver" 
  onClick={() => navigate('/')}
>
  ← Volver a la lista
</button>
```

### 📝 Explicación:
- `useNavigate()`: Hook para navegación programática
- `navigate('/')`: Navega a la ruta raíz
- Se puede usar también `navigate(-1)` para ir a la página anterior

### ✅ Verificación:
- Al hacer clic en "Volver", debe regresar a la lista de posts
- La navegación debe ser instantánea (sin recarga)

---

## 🎨 PASO 8 (OPCIONAL): Mejoras adicionales

### A. Agregar búsqueda de posts

En `ListaPosts.jsx`:

```jsx
const [busqueda, setBusqueda] = useState('');

const postsFiltrados = posts.filter(post =>
  post.title.toLowerCase().includes(busqueda.toLowerCase()) ||
  post.body.toLowerCase().includes(busqueda.toLowerCase())
);

// En el JSX, antes de posts-grid:
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

// Usar postsFiltrados en lugar de posts
<div className="posts-grid">
  {postsFiltrados.map(post => (
    // ...
  ))}
</div>
```

### B. Limitar el número de posts mostrados

```jsx
const [limite, setLimite] = useState(20);

// En el fetch:
const respuesta = await fetch(
  `https://jsonplaceholder.typicode.com/posts?_limit=${limite}`
);
```

### C. Agregar indicador de carga con skeleton

```jsx
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
```

---

## 🧪 PASO 9: Probar la aplicación completa

### Lista de verificación:

- [ ] La lista de posts se carga correctamente
- [ ] Aparece un spinner mientras carga
- [ ] Los errores se muestran adecuadamente
- [ ] Al hacer clic en un post, navega al detalle
- [ ] El detalle muestra toda la información
- [ ] Se muestra el nombre del autor
- [ ] El botón "Volver" funciona correctamente
- [ ] La URL cambia según la navegación
- [ ] No hay errores en la consola

### Pruebas manuales:

1. **Recargar la página principal** → Debe funcionar
2. **Navegar directamente a** `/post/5` → Debe mostrar el post 5
3. **Simular error de red** (DevTools → Network → Offline) → Debe mostrar mensaje de error
4. **Navegar entre varios posts** → Todo debe funcionar fluido

---

## 📚 Conceptos clave aprendidos

### React Hooks:
- ✅ `useState`: Manejar estado local
- ✅ `useEffect`: Efectos secundarios (llamadas API)
- ✅ `useParams`: Obtener parámetros de URL
- ✅ `useNavigate`: Navegación programática

### React Router:
- ✅ `BrowserRouter`: Habilitar routing
- ✅ `Routes` y `Route`: Definir rutas
- ✅ `Link`: Navegación declarativa
- ✅ Rutas dinámicas con parámetros

### Consumo de APIs:
- ✅ Fetch API
- ✅ Manejo de promesas con async/await
- ✅ Manejo de estados: cargando, error, datos
- ✅ Validación de respuestas HTTP

### Buenas prácticas:
- ✅ Separación de componentes
- ✅ Manejo de errores
- ✅ Estados de carga (UX)
- ✅ Cleanup en useEffect
- ✅ Validaciones antes de renderizar

---

## 🚀 Próximos pasos sugeridos

1. **Agregar paginación** a la lista de posts
2. **Implementar caché** de datos ya cargados
3. **Agregar comentarios** del post (API: `/posts/1/comments`)
4. **Crear formulario** para agregar nuevos posts (POST request)
5. **Implementar filtros** por usuario
6. **Agregar animaciones** con Framer Motion
7. **Mejorar estilos** con Tailwind CSS o styled-components
8. **Implementar Context API** para estado global

---

## 📖 Recursos adicionales

- **React Router Docs**: https://reactrouter.com/
- **JSONPlaceholder**: https://jsonplaceholder.typicode.com/
- **Fetch API**: https://developer.mozilla.org/es/docs/Web/API/Fetch_API
- **React Hooks**: https://react.dev/reference/react

---

## 🆘 Problemas comunes y soluciones

### Error: "Cannot read properties of null"
**Solución**: Agregar validaciones condicionales (`post && post.title`)

### Los datos no se cargan
**Solución**: Verificar la URL de la API y la consola del navegador

### El routing no funciona
**Solución**: Verificar que `BrowserRouter` envuelve todo el componente

### "Warning: Each child should have a unique key"
**Solución**: Agregar `key={post.id}` en el map

### Los estilos no se aplican
**Solución**: Verificar que App.css está importado y las clases coinciden

---

**¡Éxito en tu proyecto!** 🎉
