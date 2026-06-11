require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function main() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    await client.connect();

    const existe = await client.query(
        'SELECT id FROM usuarios WHERE nombre = $1',
        ['admin'],
    );

    if (existe.rowCount > 0) {
        console.log('El usuario admin ya existe.');
        await client.end();
        return;
    }

    const hash = bcrypt.hashSync('admin123', 10);
    await client.query(
        'INSERT INTO usuarios (nombre, clave, estado) VALUES ($1, $2, $3)',
        ['admin', hash, 'ACTIVO'],
    );

    console.log('Usuario creado: admin / admin123');
    await client.end();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
