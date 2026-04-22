import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Search, Filter, X, BookOpen, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { recursoService } from '../../services/recursoService'
import { categoriaService } from '../../services/categoriaService'
import type { Recurso, Categoria, EstadisticaCategoria } from '../../types'

/**
 * Página de listado de Recursos
 * Muestra todos los recursos con opciones de filtrado y búsqueda
 */
function RecursosList() {
  const [recursos, setRecursos] = useState<Recurso[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<number | '' | 'sin-categoria'>('')
  const [busquedaAutor, setBusquedaAutor] = useState('')
  const [statsCategoria, setStatsCategoria] = useState<EstadisticaCategoria[]>([])
  
  // Paginación
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  })
  const LIMIT = 50

  // Cargar datos al montar el componente o cambiar página
  useEffect(() => {
    loadData()
  }, [page])

  /**
   * Cargar recursos y categorías desde la API
   */
  const loadData = async () => {
    try {
      setLoading(true)
      const [recursosData, categoriasData, statsData] = await Promise.all([
        recursoService.getAll(page, LIMIT),
        categoriaService.getAll(),
        recursoService.getEstadisticas()
      ])
      setRecursos(recursosData.data)
      setPagination(recursosData.pagination)
      setCategorias(categoriasData)
      setStatsCategoria(statsData)
    } catch (err) {
      setError('Error al cargar los datos. Verifica que el servidor esté corriendo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Eliminar un recurso
   */
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este recurso?')) return

    try {
      await recursoService.delete(id)
      setRecursos(recursos.filter(r => r.id !== id))
    } catch (err) {
      alert('Error al eliminar el recurso')
      console.error(err)
    }
  }

  /**
   * Filtrar recursos por categoría o autor
   */
  const handleFiltrar = async () => {
    if (!filtroCategoria && !busquedaAutor.trim()) {
      loadData()
      return
    }

    try {
      setLoading(true)
      let resultado: Recurso[] = []

      if (busquedaAutor.trim()) {
        resultado = await recursoService.searchByAutor(busquedaAutor)
      } else if (filtroCategoria === 'sin-categoria') {
        resultado = await recursoService.getSinCategoria()
      } else if (filtroCategoria) {
        resultado = await recursoService.filterByCategoria(Number(filtroCategoria))
      }

      setRecursos(resultado)
      setPagination({ total: resultado.length, pages: 1, hasNext: false, hasPrev: false })
    } catch (err) {
      setError('Error al filtrar recursos')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Limpiar filtros y recargar
   */
  const limpiarFiltros = () => {
    setFiltroCategoria('')
    setBusquedaAutor('')
    loadData()
  }

  /**
   * Eliminar TODOS los recursos
   */
  const handleDeleteAll = async () => {
    if (!confirm('¿ESTÁS SEGURO?\n\nEsta acción eliminará TODOS los recursos de la base de datos.\n\nEsta operación no se puede deshacer.\n\n¿Deseas continuar?')) return
    
    if (!confirm('CONFIRMACIÓN FINAL\n\nSe borrarán todos los recursos, categorías y sus relaciones.\n\n¿Continuar?')) return

    try {
      setLoading(true)
      const response = await fetch('/api/recursos', { method: 'DELETE' })
      const result = await response.json()
      
      if (result.success) {
        alert(`${result.message}\n\nRecursos eliminados: ${result.data.recursosEliminados}\nCategorías eliminadas: ${result.data.categoriasEliminadas}\nRelaciones eliminadas: ${result.data.relacionesEliminadas}`)
        loadData()
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Error al eliminar todos los recursos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-cyan border border-neon-cyan">
            <BookOpen className="h-6 w-6" style={{ color: 'var(--neon-cyan)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Recursos Académicos</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Gestiona libros, manuales y otros recursos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteAll}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all"
            style={{ color: 'var(--neon-orange)', background: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.3)' }}
            title="Eliminar TODOS los recursos"
          >
            <AlertTriangle className="h-4 w-4" />
            Eliminar Todo
          </button>
          <Link
            to="/recursos/nuevo"
            className="flex items-center gap-2 px-4 py-2 btn-neon rounded-lg text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Nuevo Recurso
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="neon-card rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium mb-1.5 neon-text-pink" style={{ fontSize: '0.7rem' }}>
              <Search className="h-3.5 w-3.5 inline mr-1" />
              Buscar por autor
            </label>
            <input
              type="text"
              value={busquedaAutor}
              onChange={(e) => setBusquedaAutor(e.target.value)}
              placeholder="Nombre del autor..."
              className="w-full px-3 py-2 input-neon rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 neon-text-green" style={{ fontSize: '0.7rem' }}>
              <Filter className="h-3.5 w-3.5 inline mr-1" />
              Categoría
            </label>
            <select
              value={filtroCategoria}
              onChange={(e) => {
                const v = e.target.value;
                setFiltroCategoria(v === '' ? '' : v === 'sin-categoria' ? 'sin-categoria' : Number(v));
              }}
              className="w-full px-3 py-2 input-neon rounded-lg text-sm"
            >
              <option value="">Todas ({pagination.total})</option>
              <option value="sin-categoria">Sin categoría</option>
              {categorias.map(c => {
                const stat = statsCategoria.find(s => s.categoria === c.nombre)
                return (
                  <option key={c.id} value={c.id}>{c.nombre} ({stat?.count || 0})</option>
                )
              })}
            </select>
          </div>

          <div className="flex gap-2 md:col-span-2 justify-end">
            <button
              onClick={handleFiltrar}
              className="px-4 py-2 text-sm rounded-lg transition-all"
              style={{ color: 'var(--neon-cyan)', background: 'rgba(0,255,247,0.12)', border: '1px solid rgba(0,255,247,0.3)' }}
            >
              Aplicar filtros
            </button>
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="spinner-neon h-10 w-10 mx-auto"></div>
          <p className="mt-4 text-sm neon-pulse" style={{ color: 'var(--neon-cyan)' }}>Cargando recursos...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.3)' }}>
          <p className="text-sm" style={{ color: '#ff6b6b' }}>{error}</p>
          <button onClick={loadData} className="mt-2 px-4 py-1.5 text-sm rounded-lg" style={{ color: '#ff6b6b', background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)' }}>
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <div className="neon-card rounded-xl overflow-hidden">
          {/* Paginación arriba */}
          <div className="px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(0,255,247,0.03)', borderBottom: '1px solid rgba(0,255,247,0.1)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Mostrando <span className="font-semibold neon-text-cyan">{recursos.length}</span> de{' '}
              <span className="font-semibold neon-text-cyan">{pagination.total.toLocaleString()}</span> recursos
              {pagination.pages > 1 && (
                <span className="ml-1" style={{ color: '#4a5568' }}>— Pág. <span className="neon-text-pink">{page}</span> de {pagination.pages}</span>
              )}
            </p>
            {pagination.pages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev || loading}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  style={{ color: 'var(--neon-cyan)', border: '1px solid rgba(0,255,247,0.2)' }}
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Ant
                </button>
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let startPage = Math.max(1, page - 2);
                  const endPage = Math.min(pagination.pages, startPage + 4);
                  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
                  const pageNum = startPage + i;
                  if (pageNum > pagination.pages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                      className="w-8 h-8 text-xs rounded-md transition-all"
                      style={pageNum === page
                        ? { background: 'var(--neon-cyan)', color: '#070b14', fontWeight: 'bold', boxShadow: '0 0 12px rgba(0,255,247,0.4)' }
                        : { color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }
                      }
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={!pagination.hasNext || loading}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  style={{ color: 'var(--neon-cyan)', border: '1px solid rgba(0,255,247,0.2)' }}
                >
                  Sig <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(0,255,247,0.04)', borderBottom: '1px solid rgba(0,255,247,0.1)' }}>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-cyan)' }}>Título</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-pink)' }}>Autor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-green)' }}>Categorías</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--neon-purple)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recursos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center" style={{ color: 'var(--text-secondary)' }}>
                      No hay recursos registrados
                    </td>
                  </tr>
                ) : (
                  recursos.map((recurso) => (
                    <tr key={recurso.id} className="transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,255,247,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-6 py-3.5">
                        <span className="font-medium text-sm" style={{ color: '#e8edf5' }}>{recurso.titulo}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{recurso.autor}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {recurso.categorias?.map((cat, idx) => {
                            const colors = ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-green)', 'var(--neon-orange)', 'var(--neon-purple)']
                            const c = colors[idx % colors.length]
                            return (
                              <span key={cat.id} className="px-2 py-0.5 text-xs font-medium rounded-full"
                                style={{ color: c, background: `${c}15`, border: `1px solid ${c}40` }}>
                                {cat.nombre}
                              </span>
                            )
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex justify-end gap-1">
                          <Link to={`/recursos/editar/${recurso.id}`}
                            className="p-1.5 rounded-md transition-all"
                            style={{ color: 'var(--neon-cyan)' }}
                            title="Editar">
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button onClick={() => handleDelete(recurso.id)}
                            className="p-1.5 rounded-md transition-all"
                            style={{ color: 'var(--neon-orange)' }}
                            title="Eliminar">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecursosList
