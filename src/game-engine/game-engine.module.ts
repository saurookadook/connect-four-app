import { Module } from '@nestjs/common';

import { GameSessionModule } from '@game-engine/session/game-session.module';
import { GameEngineService } from '@game-engine/game-engine.service';

@Module({
  controllers: [],
  imports: [GameSessionModule],
  providers: [GameEngineService],
})
export class GameEngineModule {}
