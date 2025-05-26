import { Module } from '@nestjs/common';
// import { getModelToken } from '@nestjs/mongoose';

// import { GameSession } from '@game-engine/schemas/game-session.schema';
import { GameSessionService } from '@game-engine/session/game-session.service';

// const gameSessionModel = {};

@Module({
  controllers: [],
  imports: [],
  providers: [
    GameSessionService,
    // {
    //   provide: getModelToken(GameSession.name),
    //   useValue: gameSessionModel,
    // },
  ],
})
export class GameSessionModule {}
