import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  GameSession,
  GameSessionSchema,
} from '@game-engine/schemas/game-session.schema';
import { GameSessionService } from '@game-engine/session/game-session.service';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      { name: GameSession.name, schema: GameSessionSchema },
    ]),
  ],
  providers: [GameSessionService],
})
export class GameSessionModule {}
