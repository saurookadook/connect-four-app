import { ConfigService } from '@nestjs/config';

import { sharedLog } from '@connect-four-app/shared';

const logger = sharedLog.getLogger('config');

const safeSetInt = (val: unknown, fallback: number): number =>
  typeof val === 'string' ? parseInt(val, 10) : fallback;

export function buildConnectionURI(configService: ConfigService) {
  const host = configService.get('database.host');
  const port = configService.get('database.port');
  const dbName = configService.get('database.dbName');

  // logger.log(`Connection URI parts: `, { host, port, dbName });
  return `mongodb://${host}:${port}/${dbName}`;
}

export default () => {
  const {
    MONGO_DB_NAME, // force formatting
    MONGO_HOST,
    MONGO_PORT,
    SERVER_PORT,
  } = process.env;

  return {
    port: safeSetInt(SERVER_PORT, 3000),
    database: {
      dbName: MONGO_DB_NAME || 'connect-four',
      host: MONGO_HOST || 'localhost',
      port: safeSetInt(MONGO_PORT, 27017),
    },
  };
};
