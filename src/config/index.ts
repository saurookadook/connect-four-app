import { ConfigService } from '@nestjs/config';

const safeSetInt = (val: unknown, fallback: number): number =>
  typeof val === 'string' ? parseInt(val, 10) : fallback;

export function buildConnectionURI(configService: ConfigService) {
  const host = configService.get('database.host');
  const port = configService.get('database.port');
  const dbName = configService.get('database.dbName');

  // console.log(`Connection URI parts: `, { host, port, dbName });
  return `mongodb://${host}:${port}/${dbName}`;
}

export default () => ({
  port: safeSetInt(process.env.PORT, 3000),
  database: {
    dbName: process.env.MONGO_DB_NAME || 'connect-four',
    host: process.env.MONGO_HOST || 'localhost',
    port: safeSetInt(process.env.MONGO_PORT, 27017),
  },
});
