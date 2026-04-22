import { Request, Response } from 'express';
import { RecursoService } from '../service/recurso.service';

// Instancia del servicio
const recursoService = new RecursoService();

/**
 * Controlador de Recursos - Maneja las peticiones HTTP
 */
export class RecursoController {
  
  /**
   * GET /recursos - Listar recursos con paginación
   * Query params: ?page=1&limit=50
   */
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const resultado = await recursoService.findAll(page, limit);
      
      res.json({
        success: true,
        data: resultado.recursos,
        pagination: {
          page,
          limit,
          total: resultado.total,
          pages: resultado.pages,
          hasNext: page < resultado.pages,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener los recursos',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /recursos/:id - Obtener un recurso por ID
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const recurso = await recursoService.findById(id);
      
      if (!recurso) {
        res.status(404).json({
          success: false,
          message: `Recurso con ID ${id} no encontrado`
        });
        return;
      }

      res.json({
        success: true,
        data: recurso
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener el recurso',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /recursos - Crear un nuevo recurso
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, autor, categoriaIds } = req.body;

      // Validación básica
      if (!titulo || !autor) {
        res.status(400).json({
          success: false,
          message: 'El título y el autor son obligatorios'
        });
        return;
      }

      const recurso = await recursoService.create({
        titulo,
        autor,
        categoriaIds
      });

      res.status(201).json({
        success: true,
        message: 'Recurso creado exitosamente',
        data: recurso
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear el recurso',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * PUT /recursos/:id - Actualizar un recurso
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { titulo, autor, categoriaIds } = req.body;

      const recurso = await recursoService.update(id, {
        titulo,
        autor,
        categoriaIds
      });

      if (!recurso) {
        res.status(404).json({
          success: false,
          message: `Recurso con ID ${id} no encontrado`
        });
        return;
      }

      res.json({
        success: true,
        message: 'Recurso actualizado exitosamente',
        data: recurso
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el recurso',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * DELETE /recursos/:id - Eliminar un recurso
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await recursoService.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Recurso con ID ${id} no encontrado`
        });
        return;
      }

      res.json({
        success: true,
        message: 'Recurso eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el recurso',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /recursos/autor/:autor - Buscar recursos por autor
   */
  async findByAutor(req: Request, res: Response): Promise<void> {
    try {
      const { autor } = req.params;
      const recursos = await recursoService.findByAutor(autor);

      res.json({
        success: true,
        data: recursos,
        count: recursos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al buscar recursos por autor',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /recursos/categoria/:categoriaId - Filtrar recursos por categoría
   */
  async findByCategoria(req: Request, res: Response): Promise<void> {
    try {
      const categoriaId = parseInt(req.params.categoriaId);
      const recursos = await recursoService.findByCategoria(categoriaId);

      res.json({
        success: true,
        data: recursos,
        count: recursos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al filtrar recursos por categoría',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /recursos/estadisticas/conteo - Contar recursos por categoría
   */
  async countByCategoria(req: Request, res: Response): Promise<void> {
    try {
      const estadisticas = await recursoService.countByCategoria();

      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * CONSULTA 6: GET /recursos/sin-categoria - Mostrar recursos sin categoría
   */
  async findSinCategoria(req: Request, res: Response): Promise<void> {
    try {
      const recursos = await recursoService.findSinCategoria();

      res.json({
        success: true,
        message: 'Recursos sin categoría asignada',
        data: recursos,
        count: recursos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener recursos sin categoría',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * CONSULTA 7: GET /recursos/analisis/prediccion - Predecir valores futuros con Laplace
   */
  async predecirCrecimiento(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await recursoService.predecirCrecimiento();

      res.json({
        success: true,
        message: 'Predicción de crecimiento usando Transformada de Laplace Discreta',
        data: resultado,
        explicacion: 'L{f}(s) = Σ f(n)e^(-sn) donde f(n) es la función de recursos en tiempo discreto'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al realizar predicción',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * CONSULTA 8: GET /recursos/analisis/distribucion - Análisis de señal con Laplace
   */
  async analizarDistribucion(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await recursoService.analizarDistribucionCategorias();

      res.json({
        success: true,
        message: 'Análisis de distribución usando Transformada de Laplace',
        data: resultado,
        explicacion: 'F(s) analiza la distribución de recursos como una señal compleja en el dominio s'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al analizar distribución',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * DELETE /recursos - Eliminar TODOS los recursos
   * ⚠️ Operación destructiva - requiere confirmación
   */
  async deleteAll(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await recursoService.deleteAll();

      res.json({
        success: true,
        message: 'Todos los recursos han sido eliminados',
        data: resultado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar todos los recursos',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
