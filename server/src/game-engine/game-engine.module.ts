import { Module } from '@nestjs/common';

import { BoardStatesModule } from './board-states/board-states.module';
import { GameSessionsModule } from './sessions/game-sessions.module';
import { GameEngineController } from './game-engine.controller';
import { GameEngineService } from './game-engine.service';

@Module({
  controllers: [GameEngineController],
  imports: [BoardStatesModule, GameSessionsModule],
  providers: [GameEngineService],
  exports: [GameEngineService],
})
export class GameEngineModule {}
