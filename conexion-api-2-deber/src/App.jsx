import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import ListaPosts from './components/ListaPosts'
import DetallePost from './components/DetallePost'
import FormularioPost from './components/FormularioPost'
import CrearPost from './components/CrearPost'

function App() {
  return (
    <div className="App">
      <header>
        <h1>App de Posts</h1>
        <p>Aplicación para visualizar posts y sus detalles</p>
      </header>

      <main>
        {/* Aquí irá el contenido de la aplicación */}
        <p>[x] Paso 1: Instalar React Router</p>
        <p>[x] Paso 2: Crear componentes ListaPosts y DetallePost</p>
        <p>[x] Paso 3: Configurar rutas</p>
        <p>[x] Paso 4: Implementar consumo de API</p>
        <Link to="/posts/new">Crear Nuevo Post</Link>
        <Routes>
          <Route path="/" element={<ListaPosts />} />
          <Route path="/posts/:id" element={<DetallePost />} />
          <Route path="/posts/new" element={<FormularioPost />} />
          <Route path="/crear" element={<CrearPost />} />
        </Routes>

      </main>
    </div>
  )
}

export default App
