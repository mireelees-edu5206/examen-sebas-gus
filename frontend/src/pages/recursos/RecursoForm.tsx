import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, BookOpen } from 'lucide-react'
import { recursoService } from '../../services/recursoService'
import { categoriaService } from '../../services/categoriaService'
import type { Recurso, Categoria, RecursoFormData } from '../../types'

/**
 * Formulario para crear o editar un Recurso
 * Incluye selección múltiple de categorías
 */
function RecursoForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState<RecursoFormData>({
    titulo: '',
    autor: '',
    categoriaIds: []
  })
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Cargar datos al montar
  useEffect(() => {
    loadCategorias()
    if (isEditing) {
      loadRecurso()
    }
  }, [id])

  /**
   * Cargar lista de categorías disponibles
   */
  const loadCategorias = async () => {
    try {
      const data = await categoriaService.getAll()
      setCategorias(data)
    } catch (err) {
      setError('Error al cargar categorías')
    }
  }

  /**
   * Cargar datos del recurso en modo edición
   */
  const loadRecurso = async () => {
    try {
      setLoading(true)
      const recurso: Recurso = await recursoService.getById(Number(id))
      setFormData({
        titulo: recurso.titulo,
        autor: recurso.autor,
        categoriaIds: recurso.categorias?.map(c => c.id) || []
      })
    } catch (err) {
      setError('Error al cargar el recurso')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Manejar cambios en los campos del formulario
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /**
   * Manejar selección/deselección de categorías
   */
  const handleCategoriaToggle = (categoriaId: number) => {
    setFormData(prev => ({
      ...prev,
      categoriaIds: prev.categoriaIds.includes(categoriaId)
        ? prev.categoriaIds.filter(id => id !== categoriaId)
        : [...prev.categoriaIds, categoriaId]
    }))
  }

  /**
   * Guardar el recurso (crear o actualizar)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación
    if (!formData.titulo.trim() || !formData.autor.trim()) {
      setError('El título y el autor son obligatorios')
      return
    }

    try {
      setSaving(true)
      setError('')

      if (isEditing) {
        await recursoService.update(Number(id), formData)
      } else {
        await recursoService.create(formData)
      }

      navigate('/recursos')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el recurso')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/recursos" className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-pink" style={{ border: '1px solid rgba(255,45,255,0.3)' }}>
            <BookOpen className="h-6 w-6" style={{ color: 'var(--neon-pink)' }} />
          </div>
          <h1 className="text-2xl font-bold gradient-text">
            {isEditing ? 'Editar Recurso' : 'Nuevo Recurso'}
          </h1>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="spinner-neon h-10 w-10 mx-auto"></div>
          <p className="mt-4 text-sm neon-pulse" style={{ color: 'var(--neon-cyan)' }}>Cargando...</p>
        </div>
      )}

      {/* Formulario */}
      {!loading && (
        <form onSubmit={handleSubmit} className="neon-card rounded-xl p-6">
          {/* Error */}
          {error && (
            <div className="rounded-lg p-4 mb-6" style={{ background: 'rgba(255,60,60,0.08)', border: '1px solid rgba(255,60,60,0.3)' }}>
              <p className="text-sm" style={{ color: '#ff6b6b' }}>{error}</p>
            </div>
          )}

          {/* Campo Título */}
          <div className="mb-5">
            <label htmlFor="titulo" className="block text-sm font-medium mb-1.5 neon-text-cyan">
              Título <span style={{ color: 'var(--neon-pink)' }}>*</span>
            </label>
            <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange}
              className="w-full px-4 py-2.5 input-neon rounded-lg text-sm" placeholder="Ej: Manual de Linux" required />
          </div>

          {/* Campo Autor */}
          <div className="mb-5">
            <label htmlFor="autor" className="block text-sm font-medium mb-1.5 neon-text-pink">
              Autor <span style={{ color: 'var(--neon-cyan)' }}>*</span>
            </label>
            <input type="text" id="autor" name="autor" value={formData.autor} onChange={handleChange}
              className="w-full px-4 py-2.5 input-neon rounded-lg text-sm" placeholder="Ej: Linus Torvalds" required />
          </div>

          {/* Selección de Categorías */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 neon-text-green">Categorías</label>
            {categorias.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No hay categorías disponibles.{' '}
                <Link to="/categorias/nueva" style={{ color: 'var(--neon-cyan)' }}>Crear una categoría</Link>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categorias.map((categoria, idx) => {
                  const colors = ['var(--neon-cyan)', 'var(--neon-pink)', 'var(--neon-green)', 'var(--neon-orange)', 'var(--neon-purple)']
                  const c = colors[idx % colors.length]
                  const selected = formData.categoriaIds.includes(categoria.id)
                  return (
                    <button key={categoria.id} type="button" onClick={() => handleCategoriaToggle(categoria.id)}
                      className="px-3 py-1.5 rounded-lg text-sm transition-all"
                      style={selected
                        ? { color: c, background: `${c}18`, border: `1px solid ${c}`, boxShadow: `0 0 10px ${c}30` }
                        : { color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }
                      }>
                      {categoria.nombre}
                    </button>
                  )
                })}
              </div>
            )}
            <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
              <span className="neon-text-cyan font-semibold">{formData.categoriaIds.length}</span> categoría{formData.categoriaIds.length !== 1 && 's'} seleccionada{formData.categoriaIds.length !== 1 && 's'}
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(0,255,247,0.1)' }}>
            <Link to="/recursos" className="px-4 py-2 text-sm rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancelar
            </Link>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 text-sm btn-neon rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--neon-cyan)' }}></div> Guardando...</>
              ) : (
                <><Save className="h-4 w-4" /> {isEditing ? 'Actualizar' : 'Crear'} Recurso</>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default RecursoForm
