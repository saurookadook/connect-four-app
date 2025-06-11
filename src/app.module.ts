import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { GameEngineModule } from '@/game-engine/game-engine.module';
import { GameEventsModule } from '@/game-engine/events/game-events.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
  controllers: [AppController],
  imports: [
    DatabaseModule,
    GameEngineModule, // force formatting
    GameEventsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
