# Sistema de Gestión de Proyectos – grupoG-DAW

## Integrantes
- Gomez, Micaela
- Mernes, Eileen Isabella
- Soto, Jonatan Emanuel Luis
- Chamorro, Thiago

## Contenido de la entrega
Este archivo `.zip` contiene:
- código fuente del backend
- código fuente del frontend
- configuración utilizada para despliegue local con PM2 y Nginx

## Descripción
Trabajo Final Integrador correspondiente al sistema de gestión de proyectos.

El sistema permite:
- gestión de proyectos
- gestión de tareas
- estadísticas generales
- gestión de clientes
- registro de datos de contacto de clientes, incluyendo teléfono y correo electrónico

## Tecnologías utilizadas
- **Backend:** NestJS, TypeORM, PostgreSQL, JWT
- **Frontend:** Angular, PrimeNG
- **Despliegue local:** PM2 y Nginx

## Requisitos previos
- Node.js
- npm
- PostgreSQL

## Configuración de variables de entorno
Crear un archivo `.env` en backend con una estructura similar a esta:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=*****
DB_NAME=gestor_de_proyectos
DB_LOGGING=true
SWAGGER_HABILITADO=true
JWT_SECRET=*****



