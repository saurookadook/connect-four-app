import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

import { type PlayerID, type PlayerMove } from '@connect-four-app/shared';
import { GameSessionDTO } from '@/game-engine/dtos';
import {
  BoardState,
  BoardStateDocument,
  NullableBoardStateDocument,
  GameSession,
  GameSessionDocument,
  NullableGameSessionDocument,
} from '@/game-engine/schemas';
import { BoardStatesService } from './board-states/board-states.service';
import { GameSessionsService } from './sessions/game-sessions.service';
@Injectable()
export class GameEngineService {
  constructor(
    @InjectConnection() private dbConn: Connection,
    private readonly boardStatesService: BoardStatesService,
    private readonly gameSessionsService: GameSessionsService,
  ) {}

  // TODO: maybe this should do the following?
  // - get or create game_sessions record from DB
  // - get or create board_states record from DB
  // - populate board_state with moves from game_sessions record
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
      foundGame = await this.gameSessionsService.findOneById(
        gameSessionID || '',
      );
    }

    return (
      foundGame ??
      (await this.gameSessionsService.createOne({
        playerOneID,
        playerTwoID,
      }))
    );
  }

  async handlePlayerMove(
    playerMove: PlayerMove,
  ): Promise<NullableGameSessionDocument> {
    const gameSession = await this.gameSessionsService.findOneById(
      playerMove.gameSessionID,
    );

    return gameSession;
  }
}
