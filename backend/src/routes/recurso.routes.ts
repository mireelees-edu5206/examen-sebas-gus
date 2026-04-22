import { Router } from 'express';
import { RecursoController } from '../controller/recurso.controller';

// Crear router y controlador
const router = Router();
const recursoController = new RecursoController();

/**
 * Rutas de Recursos
 * 
 * GET    /recursos                         → Listar todos
 * POST   /recursos                         → Crear recurso
 * GET    /recursos/estadisticas/conteo    → Contar por categoría
 * GET    /recursos/sin-categoria           → CONSULTA 6: Recursos sin categoría
 * GET    /recursos/analisis/prediccion     → CONSULTA 7: Predicción con Laplace
 * GET    /recursos/analisis/distribucion   → CONSULTA 8: Análisis de señal
 * GET    /recursos/autor/:autor           → Buscar por autor
 * GET    /recursos/categoria/:id           → Filtrar por categoría
 * GET    /recursos/:id                     → Obtener uno
 * PUT    /recursos/:id                     → Actualizar
 * DELETE /recursos/:id                     → Eliminar
 */

// Rutas que NO tienen parámetros dinámicos de ID
router.get('/', recursoController.findAll);
router.post('/', recursoController.create);
router.delete('/', recursoController.deleteAll);  // ⚠️ Eliminar TODOS los recursos

// Rutas específicas DEBEN ir antes de /:id para evitar que Express interprete como ID
router.get('/estadisticas/conteo', recursoController.countByCategoria);
router.get('/sin-categoria', recursoController.findSinCategoria);           // CONSULTA 6
router.get('/analisis/prediccion', recursoController.predecirCrecimiento);   // CONSULTA 7
router.get('/analisis/distribucion', recursoController.analizarDistribucion); // CONSULTA 8
router.get('/autor/:autor', recursoController.findByAutor);
router.get('/categoria/:categoriaId', recursoController.findByCategoria);

// Rutas con :id deben ir al final
router.get('/:id', recursoController.findById);
router.put('/:id', recursoController.update);
router.delete('/:id', recursoController.delete);

export default router;
