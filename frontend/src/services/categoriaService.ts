import api from './api';
import type { Categoria, CategoriaFormData, ApiResponse } from '../types';

/**
 * Servicio para operaciones CRUD de Categorías
 */
export const categoriaService = {
  /**
   * Obtener todas las categorías con sus recursos
   */
  async getAll(): Promise<Categoria[]> {
    const response = await api.get<ApiResponse<Categoria[]>>('/categorias');
    return response.data.data;
  },

  /**
   * Obtener una categoría por ID
   */
  async getById(id: number): Promise<Categoria> {
    const response = await api.get<ApiResponse<Categoria>>(`/categorias/${id}`);
    return response.data.data;
  },

  /**
   * Crear una nueva categoría
   */
  async create(data: CategoriaFormData): Promise<Categoria> {
    const response = await api.post<ApiResponse<Categoria>>('/categorias', data);
    return response.data.data;
  },

  /**
   * Actualizar una categoría existente
   */
  async update(id: number, data: CategoriaFormData): Promise<Categoria> {
    const response = await api.put<ApiResponse<Categoria>>(`/categorias/${id}`, data);
    return response.data.data;
  },

  /**
   * Eliminar una categoría
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`);
  }
};
