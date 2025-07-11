import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';

import { applyGlobalSessionMiddleware } from '@/middleware/session.middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyGlobalSessionMiddleware(app);

  // Additional configuration available here: https://github.com/expressjs/cors#configuration-options
  app.enableCors({
    credentials: true,
    exposedHeaders: ['set-cookie'],
    methods: ['DELETE', 'GET', 'POST', 'PUT'],
    origin: [
      '.connect-four.dev',
      // 'http://localhost:5173',
      // 'http://localhost:3993',
      // 'http://127.0.0.1',
    ],
  });
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(process.env.SERVER_PORT ?? 3000);
}

void bootstrap();
