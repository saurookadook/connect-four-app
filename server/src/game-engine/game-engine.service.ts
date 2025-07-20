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

  /**
   * @note If `gameSessionID` is defined, will attempt to find a game session document.
   * If `gameSessionID` isn't defined, then a new document will be created.
   */
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

    // TODO: handle mismatch between `foundGame` and playerIDs

    if (foundGame == null) {
      foundGame = await this.gameSessionsService.createOne({
        playerOneID,
        playerTwoID,
      });
    }

    const foundBoardState =
      await this.boardStatesService.findOneByGameSessionID(foundGame.id);

    if (foundBoardState == null) {
      await this.boardStatesService.createOne({
        gameSessionID: foundGame.id,
      });
    }

    // TODO: populate BoardState with moves from GameSession

    return foundGame;
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
