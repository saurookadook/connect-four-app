import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';

import { applyGlobalSessionMiddleware } from '@/middleware/session.middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyGlobalSessionMiddleware(app);

  // Additional configuration available here: https://github.com/expressjs/cors#configuration-options
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
