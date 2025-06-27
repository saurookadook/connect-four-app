import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import * as session from 'express-session';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.SESSION_SECRET == null) {
    throw new Error("'SESSION_SECRET' environment variable is not set.");
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true },
    }),
  );

  // Additional configuration available here: https://github.com/expressjs/cors#configuration-options
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
