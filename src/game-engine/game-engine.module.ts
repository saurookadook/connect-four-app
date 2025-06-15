import { Module } from '@nestjs/common';

import { GameEngineController } from './game-engine.controller';
import { GameSessionModule } from './session/game-session.module';
import { GameEngineService } from './game-engine.service';

@Module({
  controllers: [GameEngineController],
  imports: [GameSessionModule],
  providers: [GameEngineService],
  exports: [GameEngineService],
})
export class GameEngineModule {}
