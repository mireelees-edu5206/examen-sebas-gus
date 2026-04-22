import { Router } from 'express';
import { CategoriaController } from '../controller/categoria.controller';

// Crear router y controlador
const router = Router();
const categoriaController = new CategoriaController();

/**
 * Rutas de Categorías
 * 
 * GET    /categorias      → Listar todas
 * POST   /categorias      → Crear categoría
 * GET    /categorias/:id  → Obtener una
 * PUT    /categorias/:id  → Actualizar
 * DELETE /categorias/:id  → Eliminar
 */

router.get('/', categoriaController.findAll);
router.post('/', categoriaController.create);
router.get('/:id', categoriaController.findById);
router.put('/:id', categoriaController.update);
router.delete('/:id', categoriaController.delete);

export default router;
