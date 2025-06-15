import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GameSession, GameSessionSchema } from '../schemas/game-session.schema';
import { GameSessionService } from './game-session.service';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([
      { name: GameSession.name, schema: GameSessionSchema },
    ]),
  ],
  providers: [GameSessionService],
  exports: [GameSessionService],
})
export class GameSessionModule {}
