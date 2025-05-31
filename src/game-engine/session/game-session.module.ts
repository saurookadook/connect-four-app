import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  PlayerMove,
  GameSession,
} from '@game-engine/session/game-session.entity';
import { GameSessionService } from '@game-engine/session/game-session.service';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([GameSession])],
  providers: [GameSessionService],
})
export class GameSessionModule {}
