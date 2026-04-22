# Frontend - Sistema de Gestión de Recursos Académicos

## Tecnologías
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (iconos)

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Compilar para producción
npm run build

# Previsualizar build
npm run preview
```

## Estructura de carpetas

```
src/
├── components/        # Componentes reutilizables
├── pages/            # Páginas de la aplicación
│   ├── recursos/     # CRUD de recursos
│   ├── categorias/   # CRUD de categorías
│   └── estadisticas/ # Dashboard de estadísticas
├── services/         # Servicios API (axios)
├── types/            # Tipos TypeScript
├── App.tsx           # Componente principal
├── main.tsx          # Punto de entrada
└── index.css         # Estilos globales (Tailwind)
```

## Features

- Dashboard con estadísticas en tiempo real
- CRUD completo de recursos y categorías
- Relación muchos a muchos entre recursos y categorías
- Filtrado por categoría
- Búsqueda por autor
- UI moderna con Tailwind CSS

## Proxy

El Vite config está configurado con proxy para redirigir `/api` al backend en `http://localhost:3000`
