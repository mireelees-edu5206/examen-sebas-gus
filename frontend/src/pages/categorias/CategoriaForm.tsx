import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, FolderOpen } from 'lucide-react'
import { categoriaService } from '../../services/categoriaService'
import type { Categoria, CategoriaFormData } from '../../types'

/**
 * Formulario para crear o editar una Categoría
 */
function CategoriaForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState<CategoriaFormData>({
    nombre: '',
    descripcion: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Cargar datos en modo edición
  useEffect(() => {
    if (isEditing) {
      loadCategoria()
    }
  }, [id])

  /**
   * Cargar datos de la categoría en modo edición
   */
  const loadCategoria = async () => {
    try {
      setLoading(true)
      const categoria: Categoria = await categoriaService.getById(Number(id))
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion
      })
    } catch (err) {
      setError('Error al cargar la categoría')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Manejar cambios en los campos del formulario
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /**
   * Guardar la categoría (crear o actualizar)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación
    if (!formData.nombre.trim()) {
      setError('El nombre de la categoría es obligatorio')
      return
    }

    try {
      setSaving(true)
      setError('')

      if (isEditing) {
        await categoriaService.update(Number(id), formData)
      } else {
        await categoriaService.create(formData)
      }

      navigate('/categorias')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la categoría')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/categorias" className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-purple" style={{ border: '1px solid rgba(184,41,255,0.3)' }}>
            <FolderOpen className="h-6 w-6" style={{ color: 'var(--neon-purple)' }} />
          </div>
          <h1 className="text-2xl font-bold gradient-text">
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </h1>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="spinner-neon h-10 w-10 mx-auto"></div>
          <p className="mt-4 text-sm neon-pulse" style={{ color: 'var(--neon-purple)' }}>Cargando...</p>
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

          {/* Campo Nombre */}
          <div className="mb-6">
            <label htmlFor="nombre" className="block text-sm font-medium mb-2 neon-text-purple">
              Nombre <span style={{ color: 'var(--neon-pink)' }}>*</span>
            </label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange}
              className="w-full px-4 py-2.5 input-neon rounded-lg text-sm" placeholder="Ej: Sistemas Operativos" required />
          </div>

          {/* Campo Descripción */}
          <div className="mb-6">
            <label htmlFor="descripcion" className="block text-sm font-medium mb-2 neon-text-cyan">
              Descripción
            </label>
            <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4}
              className="w-full px-4 py-2.5 input-neon rounded-lg text-sm" placeholder="Describe el propósito de esta categoría..." />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(0,255,247,0.1)' }}>
            <Link to="/categorias" className="px-4 py-2 text-sm rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancelar
            </Link>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ color: 'var(--neon-green)', background: 'rgba(57,255,20,0.12)', border: '1px solid rgba(57,255,20,0.4)' }}>
              {saving ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--neon-green)' }}></div> Guardando...</>
              ) : (
                <><Save className="h-4 w-4" /> {isEditing ? 'Actualizar' : 'Crear'} Categoría</>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CategoriaForm
