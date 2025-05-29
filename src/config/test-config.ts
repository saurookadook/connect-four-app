export default () => ({
  port:
    typeof process.env.PORT === 'string'
      ? parseInt(process.env.PORT, 10)
      : 3000,
  database: {
    host: process.env.MONGO_HOST || 'localhost',
    port:
      typeof process.env.MONGO_PORT === 'string'
        ? parseInt(process.env.MONGO_PORT, 10)
        : 27017,
    dbName: process.env.MONGO_DB_NAME || 'connect-four',
  },
});
