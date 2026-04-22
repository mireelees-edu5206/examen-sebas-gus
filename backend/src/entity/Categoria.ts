import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Recurso } from './Recurso';

/**
 * Entidad Categoria - Representa una categoría de recursos académicos
 * Ejemplos: "Sistemas", "Programación", "Bases de Datos", etc.
 */
@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  /**
   * Relación ManyToMany con Recurso
   * Una categoría puede tener muchos recursos
   * TypeORM creará automáticamente la tabla intermedia "recurso_categoria"
   */
  @ManyToMany(() => Recurso, (recurso) => recurso.categorias)
  @JoinTable({
    name: 'recurso_categoria',
    joinColumn: { name: 'categoria_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'recurso_id', referencedColumnName: 'id' }
  })
  recursos!: Recurso[];
}
