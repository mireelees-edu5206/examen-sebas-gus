import { useState, useEffect } from 'react'
import { BarChart3, BookOpen, FolderOpen, Users } from 'lucide-react'
import { recursoService } from '../../services/recursoService'
import { categoriaService } from '../../services/categoriaService'
import type { EstadisticaCategoria, Categoria } from '../../types'

/**
 * Página de Estadísticas
 * Muestra métricas y estadísticas del sistema
 */
function Estadisticas() {
  const [estadisticas, setEstadisticas] = useState<EstadisticaCategoria[]>([])
  const [totalRecursos, setTotalRecursos] = useState(0)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cargar datos al montar
  useEffect(() => {
    loadData()
  }, [])

  /**
   * Cargar todas las estadísticas
   */
  const loadData = async () => {
    try {
      setLoading(true)
      const [statsData, recursosData, categoriasData] = await Promise.all([
        recursoService.getEstadisticas(),
        recursoService.getAll(1, 1),
        categoriaService.getAll()
      ])
      setEstadisticas(statsData)
      setTotalRecursos(recursosData.pagination.total)
      setCategorias(categoriasData)
    } catch (err) {
      setError('Error al cargar las estadísticas')
    } finally {
      setLoading(false)
    }
  }

  // Calcular estadísticas adicionales
  const totalCategorias = categorias.length
  const recursosConCategorias = estadisticas.reduce((acc, s) => acc + s.count, 0)

  // Encontrar la categoría con más recursos
  const categoriaTop = estadisticas.length > 0
    ? estadisticas.reduce((max, current) => current.count > max.count ? current : max)
    : null

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-neon-green" style={{ border: '1px solid rgba(57,255,20,0.3)' }}>
          <BarChart3 className="h-6 w-6" style={{ color: 'var(--neon-green)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold gradient-text">Estadísticas del Sistema</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Métricas y análisis de recursos académicos</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="spinner-neon h-10 w-10 mx-auto"></div>
          <p className="mt-4 text-sm neon-pulse" style={{ color: 'var(--neon-green)' }}>Cargando estadísticas...</p>
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

      {!loading && !error && (
        <>
          {/* Distribución - gráfico neón */}
          <div className="neon-card rounded-xl p-6 mb-6">
            <h2 className="text-base font-semibold neon-text-cyan mb-4">Recursos por Categoría</h2>
            {estadisticas.length === 0 ? (
              <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>No hay datos disponibles</p>
            ) : (
              <div className="space-y-3">
                {estadisticas.map((stat, idx) => {
                  const porcentaje = totalRecursos > 0 ? Math.round((stat.count / totalRecursos) * 100) : 0
                  const neonColors = ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-green)', 'var(--neon-orange)', 'var(--neon-purple)', 'var(--neon-yellow)']
                  const c = neonColors[idx % neonColors.length]
                  return (
                    <div key={stat.categoria}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium" style={{ color: '#e8edf5' }}>{stat.categoria}</span>
                        <span className="text-xs" style={{ color: c }}>
                          {stat.count.toLocaleString()} ({porcentaje}%)
                        </span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-2 rounded-full transition-all" style={{ width: `${Math.max(porcentaje, 1)}%`, background: c, boxShadow: `0 0 8px ${c}` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Tarjetas neón */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: <BookOpen className="h-5 w-5" />, label: 'Total Recursos', value: totalRecursos.toLocaleString(), color: 'var(--neon-cyan)' },
              { icon: <FolderOpen className="h-5 w-5" />, label: 'Total Categorías', value: totalCategorias.toString(), color: 'var(--neon-pink)' },
              { icon: <Users className="h-5 w-5" />, label: 'Promedio Rec/Cat', value: totalCategorias > 0 ? (recursosConCategorias / totalCategorias).toFixed(1) : '0', color: 'var(--neon-green)' },
              { icon: <BarChart3 className="h-5 w-5" />, label: 'Con Categorías', value: recursosConCategorias.toLocaleString(), color: 'var(--neon-orange)' }
            ].map((card, i) => (
              <div key={i} className="neon-card rounded-xl p-5" style={{ borderColor: `${card.color}20` }}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg" style={{ background: `${card.color}12`, border: `1px solid ${card.color}30`, color: card.color }}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{card.label}</p>
                    <p className="text-xl font-bold" style={{ color: card.color, textShadow: `0 0 10px ${card.color}40` }}>{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="neon-card rounded-xl p-5" style={{ borderColor: 'rgba(0,255,247,0.15)' }}>
              <p className="text-xs font-medium mb-1 neon-text-cyan">Categoría más popular</p>
              {categoriaTop ? (
                <>
                  <p className="text-base font-semibold" style={{ color: '#e8edf5' }}>{categoriaTop.categoria}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{categoriaTop.count.toLocaleString()} recurso{categoriaTop.count !== 1 && 's'}</p>
                </>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sin datos</p>
              )}
            </div>

            <div className="neon-card rounded-xl p-5" style={{ borderColor: 'rgba(255,45,255,0.15)' }}>
              <p className="text-xs font-medium mb-1 neon-text-pink">Total asignaciones</p>
              <p className="text-base font-semibold" style={{ color: '#e8edf5' }}>{recursosConCategorias.toLocaleString()}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>recursos asignados a categorías</p>
            </div>

            <div className="neon-card rounded-xl p-5" style={{ borderColor: 'rgba(255,230,0,0.15)' }}>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--neon-yellow)', textShadow: '0 0 7px rgba(255,230,0,0.4)' }}>Sin categoría (estimado)</p>
              <p className="text-base font-semibold" style={{ color: '#e8edf5' }}>{Math.max(0, totalRecursos - recursosConCategorias).toLocaleString()}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>recursos sin asignar</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Estadisticas
