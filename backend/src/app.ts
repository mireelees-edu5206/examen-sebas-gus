import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import recursoRoutes from './routes/recurso.routes';
import categoriaRoutes from './routes/categoria.routes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Habilitar CORS para el frontend
app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsear formularios

// Middleware de logging de peticiones
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/recursos', recursoRoutes);
app.use('/categorias', categoriaRoutes);

// Ruta de verificación de salud
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? 'connected' : 'disconnected'
  });
});

// Ruta raíz - información de la API
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Sistema de Gestión de Recursos Académicos',
    version: '1.0.0',
    endpoints: {
      recursos: '/recursos',
      categorias: '/categorias',
      health: '/health'
    }
  });
});

// Manejo de rutas no encontradas (404)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores global
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * Función para inicializar datos de ejemplo
 * Se ejecuta solo si no hay datos en la base de datos
 */
async function seedDatabase(): Promise<void> {
  const categoriaRepository = AppDataSource.getRepository('Categoria');
  const recursoRepository = AppDataSource.getRepository('Recurso');

  // Verificar si ya existen categorías
  const existingCategorias = await categoriaRepository.count();
  if (existingCategorias > 0) {
    console.log('⚡ La base de datos ya contiene datos, omitiendo seed...');
    return;
  }

  console.log('🌱 Creando datos de ejemplo...');

  // Crear categorías de ejemplo
  const categorias = [
    { nombre: 'Sistemas', descripcion: 'Sistemas operativos y administración' },
    { nombre: 'Programación', descripcion: 'Lenguajes y paradigmas de programación' },
    { nombre: 'Bases de Datos', descripcion: 'Diseño y administración de bases de datos' },
    { nombre: 'Redes', descripcion: 'Redes de computadoras y comunicaciones' },
    { nombre: 'Inteligencia Artificial', descripcion: 'Machine learning y deep learning' }
  ];

  const savedCategorias = await categoriaRepository.save(categorias);
  console.log(`✅ Creadas ${savedCategorias.length} categorías`);

  // Crear recursos de ejemplo
  const recursos = [
    {
      titulo: 'Manual de Linux',
      autor: 'Linus Torvalds',
      categorias: [savedCategorias[0]] // Sistemas
    },
    {
      titulo: 'TypeScript Avanzado',
      autor: 'Anders Hejlsberg',
      categorias: [savedCategorias[1]] // Programación
    },
    {
      titulo: 'PostgreSQL en Producción',
      autor: 'Bruce Momjian',
      categorias: [savedCategorias[0], savedCategorias[2]] // Sistemas, Bases de Datos
    },
    {
      titulo: 'Redes TCP/IP',
      autor: 'Andrew Tanenbaum',
      categorias: [savedCategorias[3]] // Redes
    },
    {
      titulo: 'Deep Learning con Python',
      autor: 'François Chollet',
      categorias: [savedCategorias[1], savedCategorias[4]] // Programación, IA
    },
    {
      titulo: 'Ubuntu Server Administration',
      autor: 'Mark Shuttleworth',
      categorias: [savedCategorias[0]] // Sistemas
    }
  ];

  const savedRecursos = await recursoRepository.save(recursos);
  console.log(`✅ Creados ${savedRecursos.length} recursos`);
}

/**
 * Inicializar conexión a la base de datos y arrancar el servidor
 */
async function startServer(): Promise<void> {
  try {
    // Conectar a la base de datos
    await AppDataSource.initialize();
    console.log('✅ Conexión a PostgreSQL establecida');

    // Ejecutar seed de datos
    await seedDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════════════════');
      console.log('  🚀 Servidor iniciado en http://localhost:' + PORT);
      console.log('═══════════════════════════════════════════════════');
      console.log('  📚 API de Recursos Académicos');
      console.log('  🔗 Endpoints disponibles:');
      console.log('     • GET    http://localhost:' + PORT + '/recursos');
      console.log('     • GET    http://localhost:' + PORT + '/categorias');
      console.log('     • GET    http://localhost:' + PORT + '/health');
      console.log('═══════════════════════════════════════════════════');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();

// Manejo graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 Cerrando servidor...');
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('👋 Cerrando servidor...');
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(0);
});

export default app;
