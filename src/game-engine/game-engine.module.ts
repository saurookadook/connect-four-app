import { Module } from '@nestjs/common';

import { GameEngineController } from '@game-engine/game-engine.controller';
import { GameSessionModule } from '@game-engine/session/game-session.module';
import { GameEngineService } from '@game-engine/game-engine.service';

@Module({
  controllers: [GameEngineController],
  imports: [GameSessionModule],
  providers: [GameEngineService],
})
export class GameEngineModule {}
