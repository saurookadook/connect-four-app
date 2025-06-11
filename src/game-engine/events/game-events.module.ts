import { Module } from '@nestjs/common';
import { GameEventsGateway } from '@/game-engine/events/game-events.gateway';

@Module({
  providers: [GameEventsGateway],
})
export class GameEventsModule {}
