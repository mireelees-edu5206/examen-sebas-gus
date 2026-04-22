// Tipos principales de la aplicación

/**
 * Representa una Categoría de recursos académicos
 */
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  recursos?: Recurso[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Representa un Recurso académico
 */
export interface Recurso {
  id: number;
  titulo: string;
  autor: string;
  categorias: Categoria[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

/**
 * Estadísticas de recursos por categoría
 */
export interface EstadisticaCategoria {
  categoria: string;
  count: number;
}

/**
 * Formulario para crear/editar recurso
 */
export interface RecursoFormData {
  titulo: string;
  autor: string;
  categoriaIds: number[];
}

/**
 * Formulario para crear/editar categoría
 */
export interface CategoriaFormData {
  nombre: string;
  descripcion: string;
}

/**
 * Respuesta paginada de la API
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
