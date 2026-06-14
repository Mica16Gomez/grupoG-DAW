module.exports = {
  apps: [
    {
      name: 'gestor-de-proyectos',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'micamica',
        DB_NAME: 'gestor_de_proyectos',
        DB_LOGGING: 'true',
        SWAGGER_HABILITADO: 'true',
        JWT_SECRET: 'gtT0zY6&5Sx%7c29x&O4@^@73D&uz^xQ',
      },
    },
  ],
};