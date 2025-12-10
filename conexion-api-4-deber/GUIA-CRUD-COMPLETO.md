# Guía de Actualización: CRUD Completo con Paginación

---

## Resumen de Actualizaciones

Esta guía documenta las actualizaciones realizadas a la aplicación `conexion-api-completa` para implementar un CRUD completo con:

1. **Paginación** de resultados (10 items por página)
2. **Edición** de posts (método PUT)
3. **Eliminación** de posts (método DELETE)
4. **Mejoras en la interfaz** de usuario

---

## Objetivos de Aprendizaje

Al completar esta actualización, los estudiantes podrán:

- Implementar paginación en aplicaciones React
- Utilizar el método HTTP **PUT** para actualizar recursos
- Utilizar el método HTTP **DELETE** para eliminar recursos
- Reutilizar componentes para crear y editar (misma forma)
- Mejorar la experiencia de usuario con navegación intuitiva

---

## Archivos Modificados

### 1. **ListaPosts.jsx** - Agregada Paginación

**Cambios realizados:**

```jsx
// Estado para manejar la paginación
const [pagina, setPagina] = useState(1);
const limite = 10;

// URL actualizada con parámetros de paginación
const { data, loading: cargando, error } = useFetch(
  `${endpoint}?_page=${pagina}&_limit=${limite}`
);
```

**Controles de paginación agregados:**

```jsx
<div className="paginacion">
  <button 
    onClick={() => setPagina(p => Math.max(1, p - 1))}
    disabled={pagina === 1}
    className="btn-paginacion"
  >
    ← Anterior
  </button>
  <span className="pagina-actual">Página {pagina}</span>
  <button 
    onClick={() => setPagina(p => p + 1)}
    disabled={posts.length < limite}
    className="btn-paginacion"
  >
    Siguiente →
  </button>
</div>
```

**Características:**
- Muestra 10 posts por página
- Botón "Anterior" deshabilitado en página 1
- Botón "Siguiente" deshabilitado cuando no hay más resultados
- Indicador visual de la página actual

---

### 2. **FormularioPost.jsx** - Soporte para Crear y Editar

**Cambios realizados:**

Este componente ahora maneja tanto la creación de nuevos posts como la edición de posts existentes.

**Detección de modo (crear vs editar):**

```jsx
const { id } = useParams();
const isEditing = !!id;
```

**Carga de datos para edición:**

```jsx
useEffect(() => {
  if (isEditing) {
    const cargarPost = async () => {
      try {
        setCargando(true);
        const respuesta = await fetch(`/api/posts/${id}`);
        if (!respuesta.ok) {
          throw new Error('Error al cargar el post');
        }
        const datos = await respuesta.json();
        setFormData({
          title: datos.title,
          body: datos.body,
          userId: datos.userId
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargarPost();
  }
}, [id, isEditing]);
```

**Envío del formulario (POST o PUT):**

```jsx
const url = isEditing 
  ? `/api/posts/${id}` 
  : '/api/posts';
const method = isEditing ? 'PUT' : 'POST';

const respuesta = await fetch(url, {
  method,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
});
```

**Características:**
- Mismo formulario para crear y editar
- Título dinámico: "Crear Nuevo Post" o "Editar Post"
- Botón dinámico: "Crear" o "Actualizar"
- Navegación automática a la lista después de guardar
- Manejo de errores con mensajes visuales
- Estados de carga durante operaciones

---

### 3. **DetallePost.jsx** - Agregados Botones de Editar y Eliminar

**Función para eliminar post:**

```jsx
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
    navigate('/');
  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar el post: ' + error.message);
  } finally {
    setEliminando(false);
  }
};
```

**Botones de acción agregados:**

```jsx
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
```

**Características:**
- Confirmación antes de eliminar
- Estado de carga durante eliminación
- Navegación automática después de eliminar
- Manejo de errores con alertas
- Botón de editar que lleva al formulario en modo edición

---

### 4. **App.jsx** - Nueva Ruta para Edición

**Ruta agregada:**

```jsx
<Route path="/posts/:id/edit" element={<FormularioPost />} />
```

**Todas las rutas:**

```jsx
<Routes>
  <Route path="/" element={<ListaPosts />} />
  <Route path="/posts/:id" element={<DetallePost />} />
  <Route path="/posts/new" element={<FormularioPost />} />
  <Route path="/posts/:id/edit" element={<FormularioPost />} />
</Routes>
```

---

## Métodos HTTP Implementados

### GET - Obtener datos
```jsx
// Obtener lista con paginación
fetch('/api/posts?_page=1&_limit=10')

// Obtener un post específico
fetch('/api/posts/1')
```

### POST - Crear recurso
```jsx
fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Nuevo Post',
    body: 'Contenido...',
    userId: 1
  })
})
```

### PUT - Actualizar recurso completo
```jsx
fetch('/api/posts/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Post Actualizado',
    body: 'Nuevo contenido...',
    userId: 1
  })
})
```

### DELETE - Eliminar recurso
```jsx
fetch('/api/posts/1', {
  method: 'DELETE'
})
```

---

## Patrones de Diseño Aplicados

### 1. **Reutilización de Componentes**
El componente `FormularioPost` maneja tanto creación como edición, reduciendo código duplicado.

### 2. **Navegación Programática**
Uso de `useNavigate()` para redirigir después de acciones:
```jsx
const navigate = useNavigate();
// Después de crear/editar/eliminar
navigate('/');
```

### 3. **Confirmación de Acciones Destructivas**
```jsx
if (!window.confirm('¿Estás seguro?')) {
  return;
}
```

### 4. **Estados de Carga**
Feedback visual durante operaciones asíncronas:
```jsx
const [cargando, setCargando] = useState(false);
// En el botón
disabled={cargando}
{cargando ? 'Guardando...' : 'Guardar'}
```

### 5. **Manejo de Errores**
```jsx
try {
  // Operación
} catch (error) {
  console.error('Error:', error);
  alert('Error: ' + error.message);
}
```

---

## Flujo de Datos

### Crear Post
```
Usuario → Formulario → POST /api/posts → Servidor
                                       ↓
                       Lista actualizada ← Navigate('/')
```

### Editar Post
```
Detalle → Editar → Formulario (carga datos) → PUT /api/posts/:id
                                                      ↓
                                      Lista actualizada ← Navigate('/')
```

### Eliminar Post
```
Detalle → Eliminar → Confirmación → DELETE /api/posts/:id
                                            ↓
                            Lista actualizada ← Navigate('/')
```

### Paginación
```
Usuario → Botón Siguiente → setPagina(p => p + 1)
                                    ↓
                    useEffect detecta cambio en [pagina]
                                    ↓
                    Nueva solicitud GET con ?_page=2&_limit=10
```

---

## Conceptos Clave Aprendidos

### 1. **Parámetros de URL con React Router**
```jsx
const { id } = useParams();
```

### 2. **Renderizado Condicional**
```jsx
{isEditing ? 'Editar Post' : 'Crear Nuevo Post'}
```

### 3. **Operador Ternario para Lógica**
```jsx
const method = isEditing ? 'PUT' : 'POST';
```

### 4. **Deshabilitación Condicional de Botones**
```jsx
disabled={pagina === 1}
disabled={posts.length < limite}
```

### 5. **Query Parameters en APIs**
```jsx
?_page=1&_limit=10
```

### 6. **Navegación Programática**
```jsx
navigate('/');
navigate(-1); // Volver atrás
```

---

## Posibles Mejoras Futuras

1. **Implementar PATCH** en lugar de PUT para actualizaciones parciales
2. **Agregar búsqueda y filtrado** de posts
3. **Implementar infinite scroll** en lugar de paginación tradicional
4. **Agregar validación de formularios** más robusta
5. **Implementar toasts/notifications** en lugar de `alert()`
6. **Agregar loading states** más visuales (skeleton screens)
7. **Implementar caché** de datos para mejor rendimiento
8. **Agregar animaciones** en transiciones
9. **Implementar modo oscuro**
10. **Agregar testing** unitario y de integración

---

## Recursos Adicionales

- **React Router Documentation**: https://reactrouter.com/
- **Fetch API**: https://developer.mozilla.org/es/docs/Web/API/Fetch_API
- **HTTP Methods**: https://developer.mozilla.org/es/docs/Web/HTTP/Methods
- **JSON Server**: https://github.com/typicode/json-server
- **REST API Best Practices**: https://restfulapi.net/

---

## Conclusión

Esta actualización transforma la aplicación básica de lectura de posts en un **CRUD completo** con paginación, demostrando el uso correcto de todos los métodos HTTP principales:

- **GET**: Leer datos
- **POST**: Crear recursos
- **PUT**: Actualizar recursos
- **DELETE**: Eliminar recursos

La aplicación ahora ofrece una experiencia de usuario completa y profesional, siguiendo las mejores prácticas de desarrollo con React y APIs RESTful.
