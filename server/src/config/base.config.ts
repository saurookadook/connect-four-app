import { ConfigService } from '@nestjs/config';

import { sharedLog } from '@connect-four-app/shared';
import { isProdEnv, isTestEnv } from '@/utils/predicates';

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

export interface WSVariables {
  protocol: 'ws' | 'wss';
  host: string;
}

export default () => {
  const {
    APP_DOMAIN,
    MONGO_DB_NAME, // force formatting
    MONGO_HOST,
    MONGO_PORT,
    NODE_ENV,
    SERVER_PORT,
    WS_PORT,
  } = process.env;

  const isProd = isProdEnv(NODE_ENV);
  const isTest = isTestEnv(NODE_ENV);

  return {
    port: safeSetInt(SERVER_PORT, 3000),
    database: {
      dbName: MONGO_DB_NAME || 'connect-four',
      host: MONGO_HOST || 'localhost',
      port: safeSetInt(MONGO_PORT, 27017),
    },
    ws: {
      protocol: isTest ? 'ws' : 'wss',
      host: isTest ? `localhost:${safeSetInt(WS_PORT, 8090)}` : APP_DOMAIN,
    },
  };
};
