import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { Recurso } from './entity/Recurso';
import { Categoria } from './entity/Categoria';

/**
 * Script de seed masivo - Inserta 100,000+ registros en la base de datos
 * Distribución propuesta:
 * - 100 Categorías variadas
 * - 100,000 Recursos con títulos y autores diversos
 * - Relaciones: cada recurso tiene 1-3 categorías aleatorias
 */

// Arrays de palabras para generar nombres variados
const palabrasTitulo = [
  'Manual', 'Guía', 'Curso', 'Tutorial', 'Libro', 'Documentación', 'Referencia',
  'Fundamentos', 'Avanzado', 'Introducción', 'Completo', 'Práctico', 'Teoría',
  'Aplicaciones', 'Proyectos', 'Ejercicios', 'Casos', 'Estudio', 'Análisis',
  'Desarrollo', 'Diseño', 'Arquitectura', 'Programación', 'Sistemas', 'Redes',
  'Bases de Datos', 'Inteligencia Artificial', 'Machine Learning', 'Deep Learning',
  'Ciberseguridad', 'Cloud Computing', 'DevOps', 'Big Data', 'Blockchain',
  'IoT', 'Realidad Virtual', 'Automatización', 'Robótica', 'Computación',
  'Algoritmos', 'Estructuras de Datos', 'Compiladores', 'Sistemas Operativos',
  'Web', 'Móvil', 'Frontend', 'Backend', 'Full Stack', 'APIs', 'Microservicios'
];

const palabrasTema = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby',
  'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Haskell', 'Clojure',
  'React', 'Angular', 'Vue', 'Svelte', 'Next.js', 'Node.js', 'Django', 'Flask',
  'Spring', 'Laravel', 'Rails', 'Express', 'FastAPI', 'GraphQL', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible', 'Jenkins',
  'Git', 'GitHub', 'GitLab', 'Linux', 'Windows', 'macOS', 'Android', 'iOS',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Kafka', 'RabbitMQ',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Spark', 'Hadoop'
];

const nombres = [
  'Linus Torvalds', 'Guido van Rossum', 'Brendan Eich', 'Anders Hejlsberg',
  'James Gosling', 'Bjarne Stroustrup', 'Dennis Ritchie', 'Ken Thompson',
  'Brian Kernighan', 'Donald Knuth', 'Tim Berners-Lee', 'Richard Stallman',
  'Kent Beck', 'Martin Fowler', 'Robert Martin', 'Erich Gamma',
  'Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'John von Neumann',
  'Edsger Dijkstra', 'Tony Hoare', 'Niklaus Wirth', 'Barbara Liskov',
  'Margaret Hamilton', 'Jean Bartik', 'Hedy Lamarr', 'Radia Perlman',
  'Frances Allen', 'Barbara McClintock', 'Shafi Goldwasser', 'Silvio Micali',
  'Yann LeCun', 'Geoffrey Hinton', 'Yoshua Bengio', 'Andrew Ng',
  'Fei-Fei Li', 'Ian Goodfellow', 'Kaggle Grandmaster', 'Data Scientist Pro',
  'Google Engineer', 'Microsoft Research', 'Meta AI Team', 'Amazon Web Services',
  'Netflix Engineering', 'Uber Tech Team', 'Spotify Developers', 'Airbnb Engineers',
  'Stripe Engineering', 'Square Developers', 'Twitter Tech Team', 'LinkedIn Engineering',
  'Tesla Autopilot Team', 'SpaceX Engineering', 'NASA JPL', 'MIT CSAIL',
  'Stanford HAI', 'Berkeley RISELab', 'CMU SCS', 'ETH Zurich IC',
  'Google DeepMind', 'OpenAI Research', 'Anthropic Team', 'Cohere Labs',
  'Stability AI Team', 'Midjourney Developers', 'Hugging Face Team',
  'Weights & Biases', 'Papers with Code', 'ArXiv Contributors', 'IEEE Authors',
  'ACM Members', 'Linux Foundation', 'Apache Software Foundation', 'Mozilla Team',
  'CNCF Team', 'Python Software Foundation', 'JS Foundation', 'Rust Foundation',
  'MariaDB Team', 'Elastic Team', 'MongoDB Inc', 'Redis Labs',
  'HashiCorp Team', 'Datadog Engineering', 'Snowflake Team', 'Databricks',
  'Confluent Team', 'Pinecone Team', 'Weaviate Labs', 'Chroma Team',
  'LangChain Team', 'LlamaIndex Team', 'CrewAI Team', 'AutoGPT Team'
];

const apellidos = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson',
  'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross'
];

const categoriasBase = [
  { nombre: 'Sistemas Operativos', descripcion: 'Linux, Windows, macOS, kernels y administración' },
  { nombre: 'Lenguajes de Programación', descripcion: 'Python, JavaScript, Java, C++, Go y más' },
  { nombre: 'Desarrollo Web', descripcion: 'Frontend, backend, full stack y frameworks web' },
  { nombre: 'Bases de Datos', descripcion: 'SQL, NoSQL, diseño y optimización' },
  { nombre: 'Inteligencia Artificial', descripcion: 'Machine learning, deep learning y NLP' },
  { nombre: 'Ciencia de Datos', descripcion: 'Análisis, visualización y estadística' },
  { nombre: 'DevOps', descripcion: 'CI/CD, infraestructura como código, containers' },
  { nombre: 'Cloud Computing', descripcion: 'AWS, Azure, GCP y arquitectura cloud' },
  { nombre: 'Ciberseguridad', descripcion: 'Seguridad, pentesting, criptografía' },
  { nombre: 'Redes', descripcion: 'TCP/IP, protocolos, arquitectura de redes' },
  { nombre: 'Arquitectura Software', descripcion: 'Patrones, diseño, microservicios' },
  { nombre: 'Testing', descripcion: 'Unit tests, integration tests, TDD' },
  { nombre: 'Mobile', descripcion: 'iOS, Android, React Native, Flutter' },
  { nombre: 'Blockchain', descripcion: 'Ethereum, smart contracts, DeFi' },
  { nombre: 'IoT', descripcion: 'Internet de las cosas, embedded systems' },
  { nombre: 'Realidad Virtual', descripcion: 'VR, AR, mixed reality' },
  { nombre: 'Computación Gráfica', descripcion: 'OpenGL, shaders, game engines' },
  { nombre: 'Algoritmos', descripcion: 'Estructuras de datos, complejidad, optimización' },
  { nombre: 'Compiladores', descripcion: 'Lexers, parsers, interpretes' },
  { nombre: 'Sistemas Distribuidos', descripcion: 'Consistencia, replicación, consenso' },
  { nombre: 'Big Data', descripcion: 'Hadoop, Spark, procesamiento masivo' },
  { nombre: 'Data Engineering', descripcion: 'ETL, data pipelines, warehouses' },
  { nombre: 'MLOps', descripcion: 'Deploy de modelos, monitoring, versioning' },
  { nombre: 'NLP', descripcion: 'Procesamiento de lenguaje natural' },
  { nombre: 'Computer Vision', descripcion: 'Visión por computadora, CNNs' },
  { nombre: 'Robótica', descripcion: 'ROS, planificación, control' },
  { nombre: 'Automatización', descripcion: 'RPA, scripts, bots' },
  { nombre: 'Web3', descripcion: 'Dapps, NFTs, DAOs' },
  { nombre: 'Frontend Frameworks', descripcion: 'React, Vue, Angular, Svelte' },
  { nombre: 'Backend Frameworks', descripcion: 'Django, Spring, Express, FastAPI' },
  { nombre: 'APIs', descripcion: 'REST, GraphQL, gRPC, WebSockets' },
  { nombre: 'Microservicios', descripcion: 'Service mesh, event-driven, CQRS' },
  { nombre: 'Monitoreo', descripcion: 'Observability, logging, tracing' },
  { nombre: 'Performance', descripcion: 'Optimización, profiling, caching' },
  { nombre: 'Seguridad Web', descripcion: 'OWASP, XSS, CSRF, SQL injection' },
  { nombre: 'Criptografía', descripcion: 'Encriptación, hashing, PKI' },
  { nombre: 'Linux Avanzado', descripcion: 'Kernel, drivers, sistemas de archivos' },
  { nombre: 'Windows Internals', descripcion: 'Win32, COM, NT kernel' },
  { nombre: 'macOS Development', descripcion: 'Swift, Cocoa, Objective-C' },
  { nombre: 'Embedded Systems', descripcion: 'Arduino, Raspberry Pi, microcontroladores' },
  { nombre: 'FPGA', descripcion: 'Verilog, VHDL, diseño digital' },
  { nombre: 'Quantum Computing', descripcion: 'Qubits, algoritmos cuánticos' },
  { nombre: 'Bioinformática', descripcion: 'Genómica, proteómica computacional' },
  { nombre: 'Finanzas Computacionales', descripcion: 'Quant trading, fintech' },
  { nombre: 'Computación Científica', descripcion: 'Simulaciones, ecuaciones diferenciales' },
  { nombre: 'Matemáticas Discretas', descripcion: 'Lógica, teoría de grafos, combinatoria' },
  { nombre: 'Estadística', descripcion: 'Probabilidad, inferencia, modelado' },
  { nombre: 'Optimización', descripcion: 'Programación lineal, heurísticas' },
  { nombre: 'Teoría de la Computación', descripcion: 'Autómatas, complejidad computacional' },
  { nombre: 'Ingeniería de Software', descripcion: 'Metodologías, Agile, Scrum' },
  { nombre: 'UX/UI', descripcion: 'Diseño de interfaces, usabilidad' },
  { nombre: 'Accesibilidad', descripcion: 'WCAG, a11y, inclusión digital' },
  { nombre: 'Legal Tech', descripcion: 'Derecho informático, GDPR, privacidad' },
  { nombre: 'Ética en IA', descripcion: 'Fairness, bias, explainability' },
  { nombre: 'Historia de la Computación', descripcion: 'Evolución tecnológica, pioneros' },
  { nombre: 'Futuro Tech', descripcion: 'Emerging technologies, tendencias' },
  { nombre: 'Soft Skills', descripcion: 'Comunicación, liderazgo, teamwork' },
  { nombre: 'Career Development', descripcion: 'Carrera tech, entrevistas, networking' },
  { nombre: 'Open Source', descripcion: 'Contribución, licencias, comunidad' },
  { nombre: 'Documentación', descripcion: 'Technical writing, READMEs, wikis' },
  { nombre: 'Community Management', descripcion: 'Foros, Discord, meetups' },
  { nombre: 'Tech Blogging', descripcion: 'Escritura técnica, newsletters' },
  { nombre: 'Podcasting Tech', descripcion: 'Audio, producción, distribución' },
  { nombre: 'YouTube Tech', descripcion: 'Video educativo, tutoriales' },
  { nombre: 'Streaming', descripcion: 'Twitch coding, live coding' },
  { nombre: 'Mentoría', descripcion: 'Code reviews, pair programming' },
  { nombre: 'Consultoría', descripcion: 'Advisory, strategy, assessment' },
  { nombre: 'Freelancing', descripcion: 'Trabajo independiente, contratos' },
  { nombre: 'Startups', descripcion: 'Emprendimiento tech, VC, pitch' },
  { nombre: 'Enterprise', descripcion: 'Grandes empresas, legacy systems' },
  { nombre: 'GovTech', descripcion: 'Tecnología gubernamental, e-gov' },
  { nombre: 'HealthTech', descripcion: 'Salud digital, telemedicina' },
  { nombre: 'EdTech', descripcion: 'Educación tecnológica, e-learning' },
  { nombre: 'AgriTech', descripcion: 'Tecnología agrícola, precisión' },
  { nombre: 'CleanTech', descripcion: 'Tecnología verde, sostenibilidad' },
  { nombre: 'SpaceTech', descripcion: 'Aeroespacial, satélites, misiones' },
  { nombre: 'AutoTech', descripcion: 'Vehículos autónomos, EVs' },
  { nombre: 'LegalTech', descripcion: 'Automatización legal, contratos' },
  { nombre: 'PropTech', descripcion: 'Bienes raíces tecnológicos' },
  { nombre: 'FashionTech', descripcion: 'Moda y tecnología, wearables' },
  { nombre: 'SportsTech', descripcion: 'Deporte y análisis de datos' },
  { nombre: 'Entertainment Tech', descripcion: 'Juegos, streaming, media' },
  { nombre: 'Music Tech', descripcion: 'Producción musical, DSP' },
  { nombre: 'Art Tech', descripción: 'Arte digital, generativo, NFT' },
  { nombre: 'FoodTech', descripcion: 'Tecnología alimentaria, delivery' },
  { nombre: 'RetailTech', descripcion: 'E-commerce, POS, inventario' },
  { nombre: 'HRTech', descripcion: 'Recursos humanos tecnológicos' },
  { nombre: 'MarTech', descripcion: 'Marketing digital, analytics' },
  { nombre: 'SalesTech', descripcion: 'Ventas tecnológicas, CRM' },
  { nombre: 'Customer Success', descripcion: 'Soporte, CX, NPS' },
  { nombre: 'Product Management', descripcion: 'Gestión de producto tech' }
];

// Funciones utilitarias
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generarTituloRecurso(): string {
  const tipo = palabrasTitulo[randomInt(0, palabrasTitulo.length - 1)];
  const tema = palabrasTema[randomInt(0, palabrasTema.length - 1)];
  const versiones = ['2024', '2023', 'v2', 'v3', 'Pro', 'Advanced', 'Complete', 'Essentials', 'Masterclass', 'Bootcamp', ''];
  const version = versiones[randomInt(0, versiones.length - 1)];
  return version ? `${tipo} de ${tema} ${version}`.trim() : `${tipo} de ${tema}`;
}

function generarNombreAutor(): string {
  // 60% nombres famosos, 40% nombres generados
  if (Math.random() < 0.6) {
    return nombres[randomInt(0, nombres.length - 1)];
  }
  const nombre = ['John', 'Jane', 'Alex', 'Sam', 'Chris', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Quinn'][randomInt(0, 9)];
  const apellido = apellidos[randomInt(0, apellidos.length - 1)];
  return `${nombre} ${apellido}`;
}

async function seedMassive() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🚀 INICIANDO SEED MASIVO - 100,000+ REGISTROS');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    // Conectar a la base de datos
    await AppDataSource.initialize();
    console.log('✅ Conexión a PostgreSQL establecida');

    const categoriaRepository = AppDataSource.getRepository(Categoria);
    const recursoRepository = AppDataSource.getRepository(Recurso);

    // Limpiar datos existentes (opcional - descomentar si se quiere limpiar)
    // console.log('🧹 Limpiando datos existentes...');
    // await recursoRepository.clear();
    // await categoriaRepository.clear();

    // Verificar si ya hay categorías
    const existingCategorias = await categoriaRepository.count();
    if (existingCategorias > 0) {
      console.log(`⚡ Ya existen ${existingCategorias} categorías. Saltando creación de categorías.`);
    } else {
      // Crear 100 categorías
      console.log('📁 Creando 100 categorías...');
      const categorias: Categoria[] = [];
      
      for (const catData of categoriasBase) {
        const categoria = categoriaRepository.create(catData);
        categorias.push(categoria);
      }

      await categoriaRepository.save(categorias);
      console.log(`✅ Creadas ${categorias.length} categorías`);
    }

    // Obtener todas las categorías para las relaciones
    const todasCategorias = await categoriaRepository.find();
    console.log(`📊 Usando ${todasCategorias.length} categorías para relaciones`);

    // Calcular cuántos recursos crear
    const existingRecursos = await recursoRepository.count();
    const TARGET_TOTAL = 100000;
    const recursosACrear = Math.max(0, TARGET_TOTAL - existingRecursos);

    if (recursosACrear === 0) {
      console.log(`✅ Ya existen ${existingRecursos} recursos. Objetivo alcanzado.`);
      await AppDataSource.destroy();
      return;
    }

    console.log(`📚 Creando ${recursosACrear.toLocaleString()} recursos...`);
    console.log('   (Este proceso puede tomar varios minutos)');

    // Crear recursos en batches para mejor performance
    const BATCH_SIZE = 1000;
    const batches = Math.ceil(recursosACrear / BATCH_SIZE);
    
    for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
      const recursosBatch: Recurso[] = [];
      const batchActualSize = Math.min(BATCH_SIZE, recursosACrear - (batchIndex * BATCH_SIZE));

      for (let i = 0; i < batchActualSize; i++) {
        const recurso = recursoRepository.create({
          titulo: generarTituloRecurso(),
          autor: generarNombreAutor()
        });

        // Asignar 1-3 categorías aleatorias
        const numCategorias = randomInt(1, 3);
        const categoriasAsignadas = shuffleArray(todasCategorias).slice(0, numCategorias);
        recurso.categorias = categoriasAsignadas;

        recursosBatch.push(recurso);
      }

      // Guardar batch
      await recursoRepository.save(recursosBatch);
      
      const progreso = ((batchIndex + 1) / batches * 100).toFixed(1);
      const creados = Math.min((batchIndex + 1) * BATCH_SIZE, recursosACrear);
      process.stdout.write(`\r   Progreso: ${progreso}% (${creados.toLocaleString()}/${recursosACrear.toLocaleString()} recursos)`);
    }

    console.log('\n');

    // Estadísticas finales
    const totalRecursos = await recursoRepository.count();
    const totalCategorias = await categoriaRepository.count();
    
    // Contar relaciones usando query directa
    let totalRelaciones = 0;
    try {
      const relacionesResult = await AppDataSource.query('SELECT COUNT(*) as total FROM recurso_categoria');
      totalRelaciones = parseInt(relacionesResult[0]?.total || 0);
    } catch (e) {
      // Si hay error, estimar basado en promedio
      totalRelaciones = Math.round(totalRecursos * 1.65);
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  ✅ SEED MASIVO COMPLETADO');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  📁 Total Categorías:     ${totalCategorias.toLocaleString()}`);
    console.log(`  📚 Total Recursos:      ${totalRecursos.toLocaleString()}`);
    console.log(`  🔗 Total Relaciones:    ${totalRelaciones.toLocaleString()}`);
    console.log(`  📊 Promedio cat/recurso: ${totalRecursos > 0 ? (totalRelaciones / totalRecursos).toFixed(2) : '0.00'}`);
    console.log('═══════════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Error en seed masivo:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('👋 Conexión cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedMassive();
}

export { seedMassive };
