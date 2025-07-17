import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

import { GameSessionDTO } from './dtos/game-session.dto';
import {
  GameSession,
  GameSessionDocument,
  NullableGameSessionDocument,
} from './schemas/game-session.schema';
import {
  BoardState,
  BoardStateDocument,
  NullableBoardStateDocument,
} from './schemas/board-states.schema';
import { GameSessionsService } from './sessions/game-sessions.service';
import { BoardStatesService } from './board-states/board-states.service';

@Injectable()
export class GameEngineService {
  constructor(
    @InjectConnection() private dbConn: Connection,
    private readonly boardStatesService: BoardStatesService,
    private readonly gameSessionsService: GameSessionsService,
  ) {
    // void this.dbConn.collection('board_states').insertOne({
    //   gameSessionID: new Types.ObjectId(),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // });
    void this.dbConn.model(BoardState.name).insertOne({
      gameSessionID: new Types.ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

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
