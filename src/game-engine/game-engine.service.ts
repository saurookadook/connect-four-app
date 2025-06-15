import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GameSessionDTO } from './dtos/game-session.dto';
import {
  GameSession,
  GameSessionDocument,
  NullableGameSessionDocument,
} from './schemas/game-session.schema';
import { GameSessionService } from './session/game-session.service';

@Injectable()
export class GameEngineService {
  constructor(private readonly gameSessionService: GameSessionService) {}

  async startGame({
    gameSessionID,
    playerOneID,
    playerTwoID,
  }: {
    gameSessionID?: GameSessionDTO['id']; // as mongodb.ObjectId
    playerOneID: GameSessionDTO['playerOneID'];
    playerTwoID: GameSessionDTO['playerTwoID'];
  }): Promise<GameSessionDocument> {
    let foundGame: NullableGameSessionDocument = null;

    if (gameSessionID != null) {
      foundGame = await this.gameSessionService.findOneById(
        gameSessionID || '',
      );
    }

    return (
      foundGame ??
      (await this.gameSessionService.createOne({
        playerOneID,
        playerTwoID,
      }))
    );
  }

  // async handlePlayerMove({
  //   gameSessionId,
  //   moveData,
  // }: {
  //   gameSessionId: UUID;
  //   moveData: {
  //     coordinates: [number, number];
  //     playerId: UUID;
  //   };
  // }): Promise<GameSessionDocument> {
  //   const gameSession = await this.gameSessionService.findOneById(gameSessionId);
  // }
}
