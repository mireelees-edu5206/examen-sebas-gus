import { Request, Response } from 'express';
import { CategoriaService } from '../service/categoria.service';

// Instancia del servicio
const categoriaService = new CategoriaService();

/**
 * Controlador de Categorías - Maneja las peticiones HTTP
 */
export class CategoriaController {
  
  /**
   * GET /categorias - Listar todas las categorías
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await categoriaService.findAll();
      res.json({
        success: true,
        data: categorias,
        count: categorias.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener las categorías',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /categorias/:id - Obtener una categoría por ID
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const categoria = await categoriaService.findById(id);
      
      if (!categoria) {
        res.status(404).json({
          success: false,
          message: `Categoría con ID ${id} no encontrada`
        });
        return;
      }

      res.json({
        success: true,
        data: categoria
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener la categoría',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /categorias - Crear una nueva categoría
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, descripcion } = req.body;

      // Validación básica
      if (!nombre) {
        res.status(400).json({
          success: false,
          message: 'El nombre de la categoría es obligatorio'
        });
        return;
      }

      const categoria = await categoriaService.create({
        nombre,
        descripcion
      });

      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: categoria
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear la categoría',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * PUT /categorias/:id - Actualizar una categoría
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { nombre, descripcion } = req.body;

      const categoria = await categoriaService.update(id, {
        nombre,
        descripcion
      });

      if (!categoria) {
        res.status(404).json({
          success: false,
          message: `Categoría con ID ${id} no encontrada`
        });
        return;
      }

      res.json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: categoria
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la categoría',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * DELETE /categorias/:id - Eliminar una categoría
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await categoriaService.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Categoría con ID ${id} no encontrada`
        });
        return;
      }

      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la categoría',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
