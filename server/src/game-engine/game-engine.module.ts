import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { GameEngineController } from './game-engine.controller';
import { GameSessionsModule } from './sessions/game-sessions.module';
import { GameEngineService } from './game-engine.service';

@Module({
  controllers: [GameEngineController],
  imports: [DatabaseModule, GameSessionsModule],
  providers: [GameEngineService],
  exports: [GameEngineService],
})
export class GameEngineModule {}
