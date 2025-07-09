import { Module } from '@nestjs/common';

import { GameEngineModule } from '../game-engine.module';
import { GameEventsGateway } from './game-events.gateway';

@Module({
  imports: [GameEngineModule],
  providers: [GameEventsGateway],
})
export class GameEventsModule {}
