import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

// Cargar variables de entorno
 dotenv.config();

/**
 * Configuración de la conexión a PostgreSQL usando TypeORM
 * Sincronización activada para desarrollo (crea tablas automáticamente)
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'sebas',
  password: process.env.DB_PASSWORD || 'sebas',
  database: process.env.DB_DATABASE || 'academic_resources',
  
  // Entidades que TypeORM gestionará
  entities: ['src/entity/**/*.ts'],
  
  // Sincronización automática (solo para desarrollo)
  synchronize: process.env.TYPEORM_SYNC === 'true',
  
  // Logging de consultas SQL (útil para debug)
  logging: false,
  
  // Configuración de migraciones
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts']
});
