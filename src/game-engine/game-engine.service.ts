import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GameSessionDTO } from '@game-engine/dtos/game-session.dto';
import {
  GameSession,
  GameSessionDocument,
  NullableGameSessionDocument,
} from '@game-engine/schemas/game-session.schema';
import { GameSessionService } from '@game-engine/session/game-session.service';

@Injectable()
export class GameEngineService {
  constructor(private readonly gameSessionService: GameSessionService) {}

  async startGame({
    playerOneID,
    playerTwoID,
  }: {
    playerOneID: GameSessionDTO['playerOneID'];
    playerTwoID: GameSessionDTO['playerTwoID'];
  }): Promise<GameSessionDocument> {
    return await this.gameSessionService.createOne({
      playerOneID,
      playerTwoID,
    });
  }

  async handlePlayerMove({
    gameSessionId,
    moveData,
  }: {
    gameSessionId: UUID;
    moveData: {
      coordinates: [number, number];
      playerId: UUID;
    };
  }): Promise<GameSessionDocument> {
    const gameSession = await this.gameSessionService.findById(gameSessionId);
  }
}
