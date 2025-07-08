import { Module } from '@nestjs/common';

import { GameEngineController } from './game-engine.controller';
import { GameSessionsModule } from './sessions/game-sessions.module';
import { GameEngineService } from './game-engine.service';

@Module({
  controllers: [GameEngineController],
  imports: [GameSessionsModule],
  providers: [GameEngineService],
  exports: [GameEngineService],
})
export class GameEngineModule {}
