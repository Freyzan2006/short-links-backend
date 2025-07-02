




export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    name: process.env.DATABASE_NAME || 'shortener',
  },
});
