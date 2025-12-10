import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import ListaPosts from './components/ListaPosts'
import DetallePost from './components/DetallePost'
import FormularioPost from './components/FormularioPost'
import ListaUsuarios from './components/ListaUsuarios'
import DetalleUsuario from './components/DetalleUsuario'
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


function App() {
  return (
    <div className="App">
      <header>
        <h1>App de Posts</h1>
        <p>Aplicación para visualizar posts y sus detalles</p>

        {/* Navegación principal */}
        <nav className="menu-principal">
          {/* Enlaces de navegación */}
          <Link to="/">Posts</Link>
          <Link to="/usuarios">Usuarios</Link>
        </nav>
      </header>

      <main>
        {/* Aquí irá el contenido de la aplicación */}
        <p>[x] Paso 1: Instalar React Router</p>
        <p>[x] Paso 2: Crear componentes ListaPosts y DetallePost</p>
        <p>[x] Paso 3: Configurar rutas</p>
        <p>[x] Paso 4: Implementar consumo de API</p>
        <p>[x] Paso 5: Agregar paginación</p>
        <p>[x] Paso 6: Implementar edición (PUT) y eliminación (DELETE)</p>
        <Link to="/posts/new">Crear Nuevo Post</Link>
        <Routes>
          <Route path="/" element={<ListaPosts />} />
          <Route path="/posts/:id" element={<DetallePost />} />
          <Route path="/posts/new" element={<FormularioPost />} />
          <Route path="/posts/:id/edit" element={<FormularioPost />} />

          {/* Rutas para usuarios */}
          <Route path="/usuarios" element={<ListaUsuarios />} />
          <Route path="/usuarios/:id" element={<DetalleUsuario />} />
        </Routes>

      </main>
    </div>
  )
}

export default App
