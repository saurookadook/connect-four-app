import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import * as connectMongoDBSession from 'connect-mongodb-session';
import * as session from 'express-session';

import baseConfig from '@/config';
import { AppModule } from './app.module';

const MongoDBStore = connectMongoDBSession(session);
const { dbName, host, port } = baseConfig().database;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.SESSION_SECRET == null) {
    throw new Error("'SESSION_SECRET' environment variable is not set.");
  }

  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: true,
      },
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      store: new MongoDBStore({
        collection: 'player_sessions',
        databaseName: dbName,
        uri: `mongodb://${host}:${port}/${dbName}`,
      }),
    }),
  );

  // Additional configuration available here: https://github.com/expressjs/cors#configuration-options
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
