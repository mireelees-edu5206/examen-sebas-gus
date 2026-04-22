import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Categoria } from './Categoria';

/**
 * Entidad Recurso - Representa un recurso académico
 * Ejemplos: libros, manuales, tutoriales, etc.
 */
@Entity('recursos')
export class Recurso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  titulo!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  autor!: string;

  /**
   * Relación ManyToMany con Categoria
   * Un recurso puede pertenecer a múltiples categorías
   * TypeORM creará automáticamente la tabla intermedia "recurso_categoria"
   */
  @ManyToMany(() => Categoria, (categoria) => categoria.recursos, {
    cascade: true, // Permite crear/actualizar categorías al guardar el recurso
    eager: false    // Las categorías se cargan bajo demanda para optimizar
  })
  @JoinTable({
    name: 'recurso_categoria',
    joinColumn: { name: 'recurso_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoria_id', referencedColumnName: 'id' }
  })
  categorias!: Categoria[];
}
