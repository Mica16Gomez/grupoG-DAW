# Sistema de Gestión de Proyectos — grupoG-DAW

Integrantes:
- Gomez, Micaela (Mica16Gomez)
- Mernes, Eileen Isabella (isabellamernes)
- Soto, Jonatan Emanuel Luis (joni4567/jesoto)
- Chamorro, Thiago (thiagocc23)

## Stack

- **Backend:** NestJS 11, TypeORM, PostgreSQL, JWT
- **Frontend:** Angular 21, PrimeNG 21

## Requisitos previos

- Node.js 20+
- PostgreSQL 14+
- npm

## 1. Base de datos

```bash
# Crear la base de datos en PostgreSQL
createdb gestion_proyectos

# Ejecutar el esquema
psql -U postgres -d gestion_proyectos -f backend/database/schema.sql

# (Opcional) Datos de ejemplo
psql -U postgres -d gestion_proyectos -f backend/database/seed.sql
```

## 2. Backend

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

npm install
node scripts/seed-admin.js   # Crea usuario admin / admin123
npm run start:dev
```

API disponible en `http://localhost:3000`  
Swagger (si `SWAGGER_HABILITADO=true`): `http://localhost:3000/api`

## 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

App disponible en `http://localhost:4200`

## Credenciales de prueba

| Usuario | Contraseña |
|---------|------------|
| admin   | admin123   |

## Funcionalidades principales

- Login con JWT
- CRUD de clientes, proyectos y tareas
- **Panel visual de tareas (Kanban):** tarjetas organizadas en columnas por estado (`PENDIENTE`, `FINALIZADA`, `BAJA`)
- Arrastrar y soltar tarjetas entre columnas para cambiar el estado
- Crear y editar tareas desde diálogo modal
- **Estadísticas:** dashboard con métricas de proyectos, tareas y clientes


## Rutas del frontend

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión |
| `/proyectos` | Listado de proyectos |
| `/proyectos/:id/tareas` | Panel Kanban de tareas del proyecto |
| `/estadisticas` | Dashboard de métricas del sistema |

## Estructura del proyecto

```
grupoG-DAW/
├── backend/          # API NestJS
│   ├── database/     # schema.sql, seed.sql
│   └── src/
└── frontend/         # App Angular
    └── src/app/
        ├── proyectos/tareas/panel/   # Componente Kanban
        └── estadisticas/             # Dashboard de métricas
```
