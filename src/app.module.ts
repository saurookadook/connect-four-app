import { MiddlewareConsumer, Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/database/database.module';
import { HttpExceptionFilterProvider } from '@/filters/filters.providers';
import { GameEngineModule } from '@/game-engine/game-engine.module';
import { GameEventsModule } from '@/game-engine/events/game-events.module';
import { SecurityMiddleware } from '@/middleware/security.middleware';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
  controllers: [AppController],
  imports: [
    AuthModule,
    DatabaseModule,
    GameEngineModule, // force formatting
    GameEventsModule,
  ],
  providers: [
    AppService, // force formatting
    HttpExceptionFilterProvider,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
