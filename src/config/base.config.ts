const safeSetInt = (val: unknown, fallback: number): number =>
  typeof val === 'string' ? parseInt(val, 10) : fallback;

export default () => ({
  port: safeSetInt(process.env.PORT, 3000),
  database: {
    dbName: process.env.MONGO_DB_NAME || 'connect-four',
    host: process.env.MONGO_HOST || 'localhost',
    port: safeSetInt(process.env.MONGO_PORT, 27017),
  },
});
