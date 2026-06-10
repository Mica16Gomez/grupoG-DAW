INSERT INTO clientes (nombre, estado) VALUES ('Cliente Demo', 'ACTIVO');

INSERT INTO proyectos (nombre, estado, id_cliente)
VALUES ('Proyecto Demo', 'ACTIVO', 1);

INSERT INTO tareas (descripcion, estado, id_proyecto) VALUES
    ('Configurar entorno de desarrollo', 'PENDIENTE', 1),
    ('Diseñar panel de tareas', 'PENDIENTE', 1),
    ('Revisar documentación', 'FINALIZADA', 1);
