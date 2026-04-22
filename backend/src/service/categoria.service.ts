import { AppDataSource } from '../data-source';
import { Categoria } from '../entity/Categoria';

// Repositorio de TypeORM
const categoriaRepository = AppDataSource.getRepository(Categoria);

/**
 * Servicio de Categorías - Contiene la lógica de negocio
 */
export class CategoriaService {
  
  /**
   * Obtener todas las categorías con sus recursos
   */
  async findAll(): Promise<Categoria[]> {
    return await categoriaRepository.find({
      relations: ['recursos'] // Carga los recursos asociados
    });
  }

  /**
   * Obtener una categoría por ID con sus recursos
   */
  async findById(id: number): Promise<Categoria | null> {
    return await categoriaRepository.findOne({
      where: { id },
      relations: ['recursos']
    });
  }

  /**
   * Crear una nueva categoría
   */
  async create(data: Partial<Categoria>): Promise<Categoria> {
    const categoria = categoriaRepository.create(data);
    return await categoriaRepository.save(categoria);
  }

  /**
   * Actualizar una categoría existente
   */
  async update(id: number, data: Partial<Categoria>): Promise<Categoria | null> {
    const categoria = await this.findById(id);
    if (!categoria) return null;

    categoriaRepository.merge(categoria, data);
    return await categoriaRepository.save(categoria);
  }

  /**
   * Eliminar una categoría
   */
  async delete(id: number): Promise<boolean> {
    const result = await categoriaRepository.delete(id);
    return result.affected !== 0;
  }
}
