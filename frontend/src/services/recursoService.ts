import api from './api';
import type { Recurso, RecursoFormData, ApiResponse, EstadisticaCategoria, PaginatedResponse } from '../types';

/**
 * Servicio para operaciones CRUD de Recursos
 */
export const recursoService = {
  /**
   * Obtener recursos con paginación
   * @param page Número de página (empieza en 1)
   * @param limit Items por página (default: 50)
   */
  async getAll(page: number = 1, limit: number = 50): Promise<PaginatedResponse<Recurso>> {
    const response = await api.get(`/recursos?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  },

  /**
   * Obtener un recurso por ID
   */
  async getById(id: number): Promise<Recurso> {
    const response = await api.get<ApiResponse<Recurso>>(`/recursos/${id}`);
    return response.data.data;
  },

  /**
   * Crear un nuevo recurso
   */
  async create(data: RecursoFormData): Promise<Recurso> {
    const response = await api.post<ApiResponse<Recurso>>('/recursos', data);
    return response.data.data;
  },

  /**
   * Actualizar un recurso existente
   */
  async update(id: number, data: RecursoFormData): Promise<Recurso> {
    const response = await api.put<ApiResponse<Recurso>>(`/recursos/${id}`, data);
    return response.data.data;
  },

  /**
   * Eliminar un recurso
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/recursos/${id}`);
  },

  /**
   * Buscar recursos por autor
   */
  async searchByAutor(autor: string): Promise<Recurso[]> {
    const response = await api.get<ApiResponse<Recurso[]>>(`/recursos/autor/${encodeURIComponent(autor)}`);
    return response.data.data;
  },

  /**
   * Filtrar recursos por categoría
   */
  async filterByCategoria(categoriaId: number): Promise<Recurso[]> {
    const response = await api.get<ApiResponse<Recurso[]>>(`/recursos/categoria/${categoriaId}`);
    return response.data.data;
  },

  /**
   * Obtener recursos sin categoría
   */
  async getSinCategoria(): Promise<Recurso[]> {
    const response = await api.get<ApiResponse<Recurso[]>>('/recursos/sin-categoria');
    return response.data.data;
  },

  /**
   * Obtener estadísticas: contar recursos por categoría
   */
  async getEstadisticas(): Promise<EstadisticaCategoria[]> {
    const response = await api.get<ApiResponse<EstadisticaCategoria[]>>('/recursos/estadisticas/conteo');
    return response.data.data;
  }
};
