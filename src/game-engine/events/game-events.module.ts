import { Module } from '@nestjs/common';

import { GameEventsGateway } from '@/game-engine/events/game-events.gateway';
import { GameEngineModule } from '@/game-engine/game-engine.module';

@Module({
  imports: [GameEngineModule],
  providers: [GameEventsGateway],
})
export class GameEventsModule {}
