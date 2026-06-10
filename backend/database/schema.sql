CREATE TYPE estados_usuarios AS ENUM ('ACTIVO', 'BAJA');
CREATE TYPE estados_clientes AS ENUM ('ACTIVO', 'BAJA');
CREATE TYPE estados_proyectos AS ENUM ('ACTIVO', 'FINALIZADO', 'BAJA');
CREATE TYPE estados_tareas AS ENUM ('PENDIENTE', 'FINALIZADA', 'BAJA');

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL UNIQUE,
    clave VARCHAR NOT NULL,
    estado estados_usuarios NOT NULL DEFAULT 'ACTIVO'
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    estado estados_clientes NOT NULL DEFAULT 'ACTIVO'
);

CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    estado estados_proyectos NOT NULL DEFAULT 'ACTIVO',
    id_cliente INTEGER REFERENCES clientes(id)
);

CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR NOT NULL,
    estado estados_tareas NOT NULL DEFAULT 'PENDIENTE',
    id_proyecto INTEGER NOT NULL REFERENCES proyectos(id)
);
