import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, FolderOpen, BookOpen } from 'lucide-react'
import { categoriaService } from '../../services/categoriaService'
import type { Categoria } from '../../types'

/**
 * Página de listado de Categorías
 * Muestra todas las categorías con sus recursos asociados
 */
function CategoriasList() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cargar categorías al montar
  useEffect(() => {
    loadCategorias()
  }, [])

  /**
   * Cargar categorías desde la API
   */
  const loadCategorias = async () => {
    try {
      setLoading(true)
      const data = await categoriaService.getAll()
      setCategorias(data)
    } catch (err) {
      setError('Error al cargar las categorías. Verifica que el servidor esté corriendo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Eliminar una categoría
   */
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Los recursos asociados perderán esta categoría.')) return

    try {
      await categoriaService.delete(id)
      setCategorias(categorias.filter(c => c.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar la categoría')
    }
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-pink" style={{ border: '1px solid rgba(255,45,255,0.3)' }}>
            <FolderOpen className="h-6 w-6" style={{ color: 'var(--neon-pink)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Categorías</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Organiza tus recursos por categorías</p>
          </div>
        </div>
        <Link to="/categorias/nueva" className="flex items-center gap-2 px-4 py-2 btn-neon rounded-lg text-sm font-medium">
          <Plus className="h-4 w-4" /> Nueva Categoría
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="spinner-neon h-10 w-10 mx-auto"></div>
          <p className="mt-4 text-sm neon-pulse" style={{ color: 'var(--neon-pink)' }}>Cargando categorías...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.3)' }}>
          <p className="text-sm" style={{ color: '#ff6b6b' }}>{error}</p>
          <button onClick={loadCategorias} className="mt-2 px-4 py-1.5 text-sm rounded-lg" style={{ color: '#ff6b6b', background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)' }}>
            Reintentar
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {categorias.length === 0 ? (
            <div className="col-span-full text-center py-16" style={{ color: 'var(--text-secondary)' }}>
              <FolderOpen className="h-12 w-12 mx-auto mb-4" style={{ color: '#2a3350' }} />
              <p>No hay categorías registradas</p>
              <Link to="/categorias/nueva" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm btn-neon">
                <Plus className="h-4 w-4" /> Crear primera categoría
              </Link>
            </div>
          ) : (
            categorias.map((categoria, catIdx) => {
              const neonColors = ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-green)', 'var(--neon-orange)', 'var(--neon-purple)']
              const accent = neonColors[catIdx % neonColors.length]
              return (
                <div key={categoria.id} className="neon-card rounded-xl p-5 transition-all" style={{ borderColor: `${accent}25` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg mt-0.5" style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}>
                        <FolderOpen className="h-5 w-5" style={{ color: accent }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold" style={{ color: '#e8edf5' }}>{categoria.nombre}</h3>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {categoria.descripcion || 'Sin descripción'}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                          <BookOpen className="h-3.5 w-3.5" style={{ color: accent }} />
                          <span style={{ color: accent }} className="font-semibold">{categoria.recursos?.length || 0}</span> recurso{categoria.recursos?.length !== 1 && 's'}
                        </div>
                        {categoria.recursos && categoria.recursos.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {categoria.recursos.slice(0, 3).map(recurso => (
                              <span key={recurso.id} className="px-2 py-0.5 text-xs rounded"
                                style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                {recurso.titulo.length > 20 ? `${recurso.titulo.slice(0, 20)}...` : recurso.titulo}
                              </span>
                            ))}
                            {categoria.recursos.length > 3 && (
                              <span className="px-2 py-0.5 text-xs rounded" style={{ background: `${accent}12`, color: accent }}>
                                +{categoria.recursos.length - 3} más
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-3">
                      <Link to={`/categorias/editar/${categoria.id}`} className="p-1.5 rounded-md transition-all" style={{ color: 'var(--neon-cyan)' }} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(categoria.id)} className="p-1.5 rounded-md transition-all" style={{ color: 'var(--neon-orange)' }} title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default CategoriasList
