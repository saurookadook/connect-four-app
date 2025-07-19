import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BoardState, BoardStateSchema } from '@/game-engine/schemas';
import { GameSessionsModule } from '../sessions/game-sessions.module';
import { BoardStatesService } from './board-states.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BoardState.name, schema: BoardStateSchema },
    ]),
    GameSessionsModule,
  ],
  providers: [BoardStatesService],
  exports: [BoardStatesService],
})
export class BoardStatesModule {}
