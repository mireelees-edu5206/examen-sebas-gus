import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { BookOpen, FolderOpen, BarChart3, Calculator, GraduationCap } from 'lucide-react'
import RecursosList from './pages/recursos/RecursosList'
import RecursoForm from './pages/recursos/RecursoForm'
import CategoriasList from './pages/categorias/CategoriasList'
import CategoriaForm from './pages/categorias/CategoriaForm'
import Estadisticas from './pages/estadisticas/Estadisticas'
import Analisis from './pages/analisis/Analisis'

/**
 * Componente principal - Tema Oscuro Neón
 * Sidebar izquierda con glow + contenido principal
 */
function App() {
  return (
    <div className="min-h-screen flex neon-bg relative">
      {/* Sidebar izquierda - oscura con bordes neón */}
      <aside className="w-64 fixed h-full flex flex-col z-20" style={{ background: 'linear-gradient(180deg, #0a0f1c 0%, #070b14 100%)', borderRight: '1px solid rgba(0, 255, 247, 0.12)' }}>
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid rgba(0, 255, 247, 0.1)' }}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-neon-cyan border border-neon-cyan">
              <GraduationCap className="h-7 w-7" style={{ color: 'var(--neon-cyan)' }} />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">Academic</span>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Resource Manager</p>
            </div>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3 neon-text-cyan" style={{ fontSize: '0.65rem' }}>Menú</p>
          <SidebarLink to="/recursos" icon={<BookOpen className="h-5 w-5" />} text="Recursos" color="cyan" />
          <SidebarLink to="/categorias" icon={<FolderOpen className="h-5 w-5" />} text="Categorías" color="pink" />
          <SidebarLink to="/estadisticas" icon={<BarChart3 className="h-5 w-5" />} text="Estadísticas" color="green" />
          <p className="text-xs font-semibold uppercase tracking-wider px-3 mt-6 mb-3 neon-text-purple" style={{ fontSize: '0.65rem' }}>Avanzado</p>
          <SidebarLink to="/analisis" icon={<Calculator className="h-5 w-5" />} text="Análisis Laplace" color="orange" />
        </nav>

        {/* Footer sidebar */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(0, 255, 247, 0.1)' }}>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2 h-2 rounded-full neon-pulse" style={{ background: 'var(--neon-green)', boxShadow: '0 0 6px var(--neon-green)' }}></span>
            Sistema activo
          </div>
          <p className="text-xs mt-1" style={{ color: '#3a4560' }}>React + TypeORM + PostgreSQL</p>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 ml-64 relative z-10">
        {/* Top bar */}
        <header className="px-8 py-4 sticky top-0 z-10" style={{ background: 'rgba(7, 11, 20, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0, 255, 247, 0.08)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sistema de Gestión de Recursos Académicos</p>
        </header>

        <main className="p-8">
          <Routes>
            <Route path="/" element={<RecursosList />} />
            <Route path="/recursos" element={<RecursosList />} />
            <Route path="/recursos/nuevo" element={<RecursoForm />} />
            <Route path="/recursos/editar/:id" element={<RecursoForm />} />
            <Route path="/categorias" element={<CategoriasList />} />
            <Route path="/categorias/nueva" element={<CategoriaForm />} />
            <Route path="/categorias/editar/:id" element={<CategoriaForm />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/analisis" element={<Analisis />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

/**
 * Enlace de sidebar neón con estado activo
 */
function SidebarLink({ to, icon, text, color = 'cyan' }: { to: string; icon: React.ReactNode; text: string; color?: string }) {
  const location = useLocation()
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/')

  const neonColors: Record<string, { active: string; border: string; glow: string }> = {
    cyan: { active: 'rgba(0,255,247,0.1)', border: 'rgba(0,255,247,0.4)', glow: '0 0 12px rgba(0,255,247,0.2)' },
    pink: { active: 'rgba(255,45,255,0.1)', border: 'rgba(255,45,255,0.4)', glow: '0 0 12px rgba(255,45,255,0.2)' },
    green: { active: 'rgba(57,255,20,0.1)', border: 'rgba(57,255,20,0.4)', glow: '0 0 12px rgba(57,255,20,0.2)' },
    orange: { active: 'rgba(255,107,0,0.1)', border: 'rgba(255,107,0,0.4)', glow: '0 0 12px rgba(255,107,0,0.2)' },
    purple: { active: 'rgba(184,41,255,0.1)', border: 'rgba(184,41,255,0.4)', glow: '0 0 12px rgba(184,41,255,0.2)' },
  }

  const c = neonColors[color] || neonColors.cyan

  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
      style={isActive ? {
        background: c.active,
        border: `1px solid ${c.border}`,
        boxShadow: c.glow,
        color: '#e8edf5'
      } : {
        color: 'var(--text-secondary)',
        border: '1px solid transparent'
      }}
    >
      <span style={isActive ? { color: c.border } : { color: '#4a5568' }}>{icon}</span>
      {text}
    </Link>
  )
}

export default App
