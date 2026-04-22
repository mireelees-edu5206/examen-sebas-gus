# Backend - Sistema de Gestión de Recursos Académicos

## Tecnologías
- Node.js
- TypeScript
- TypeORM
- PostgreSQL
- Express

## Instalación

```bash
npm install
```

## Configuración

Editar el archivo `.env` con tus credenciales de PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DATABASE=academic_resources
PORT=3000
TYPEORM_SYNC=true
```

## Crear base de datos

```sql
CREATE DATABASE academic_resources;
```

## Ejecución

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Compilar
npm run build

# Modo producción
npm start
```

## Endpoints API

### Recursos
- `GET /recursos` - Listar todos
- `POST /recursos` - Crear recurso
- `GET /recursos/:id` - Obtener uno
- `PUT /recursos/:id` - Actualizar
- `DELETE /recursos/:id` - Eliminar
- `GET /recursos/autor/:autor` - Buscar por autor
- `GET /recursos/categoria/:categoriaId` - Filtrar por categoría
- `GET /recursos/estadisticas/conteo` - Contar por categoría

### Categorías
- `GET /categorias` - Listar todas
- `POST /categorias` - Crear categoría
- `GET /categorias/:id` - Obtener una
- `PUT /categorias/:id` - Actualizar
- `DELETE /categorias/:id` - Eliminar

### Salud
- `GET /health` - Verificar estado del servidor
