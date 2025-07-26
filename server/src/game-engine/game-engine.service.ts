import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';

import {
  GameLogicEngine,
  GameSessionStatus,
  LogicSession,
  sharedLog,
  type PlayerMove, // force formatting
} from '@connect-four-app/shared';
import { GameSessionDTO } from '@/game-engine/dtos';
import {
  BoardStateDocument,
  GameSessionDocument,
  NullableGameSessionDocument,
} from '@/game-engine/schemas';
import { BoardStatesService } from './board-states/board-states.service';
import { GameSessionsService } from './sessions/game-sessions.service';
import { inspect } from 'node:util';

const logger = sharedLog.getLogger('GameEngineService');

@Injectable()
export class GameEngineService {
  #gameLogicEngine: GameLogicEngine;

  constructor(
    @InjectConnection() private dbConn: Connection,
    private readonly boardStatesService: BoardStatesService,
    private readonly gameSessionsService: GameSessionsService,
  ) {
    this.#gameLogicEngine = new GameLogicEngine();
  }

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
  }): Promise<{
    boardState: BoardStateDocument;
    gameSession: GameSessionDocument;
  }> {
    let foundGameSession: NullableGameSessionDocument = null;

    if (gameSessionID != null) {
      foundGameSession = await this.gameSessionsService.findOneById(
        gameSessionID || '',
      );
    }

    // TODO: handle mismatch between `foundGameSession` and playerIDs

    if (foundGameSession == null) {
      foundGameSession = await this.gameSessionsService.createOne({
        playerOneID,
        playerTwoID,
      });
    }

    const logicSession = this.#gameLogicEngine.startGame({
      moves: foundGameSession.moves,
      playerOneID: foundGameSession.playerOneID,
      playerTwoID: foundGameSession.playerTwoID,
    });

    const foundBoardState = await this._findOrCreateBoardState(
      foundGameSession.id,
    );

    foundBoardState.cells = logicSession.board.gameBoardState;
    await foundBoardState.save();

    return {
      boardState: foundBoardState,
      gameSession: foundGameSession,
    };
  }

  async handlePlayerMove(
    playerMove: PlayerMove, // force formatting
  ): Promise<{
    boardState: BoardStateDocument;
    gameSession: GameSessionDocument;
  }> {
    let gameSession = await this.gameSessionsService.findOneById(
      playerMove.gameSessionID,
    );

    if (gameSession == null) {
      throw new NotFoundException(
        `[GameEngineService.handlePlayerMove] Game Session with ID '${playerMove.gameSessionID}' not found`,
      );
    }

    let boardState = await this._findOrCreateBoardState(
      playerMove.gameSessionID,
    );

    const logicSession = this._handleMoveLogic(gameSession, playerMove);

    try {
      boardState = (await this.boardStatesService.updateOne(
        boardState._id.toJSON(),
        {
          gameSessionID: boardState.gameSessionID.toJSON(),
          cells: logicSession.board.gameBoardState,
          updatedAt: playerMove.timestamp,
        },
      )) as BoardStateDocument;
    } catch (error) {
      throw new Error(
        `[GameEngineService.handlePlayerMove] : ERROR saving board state - ${error.message}`,
        { cause: error },
      );
    }

    try {
      gameSession.moves.push(playerMove);
      const updateFields = {
        moves: gameSession.moves,
        status: logicSession.status,
        winner:
          logicSession.status === GameSessionStatus.COMPLETED
            ? logicSession.activePlayer
            : null,
        updatedAt: new Date(playerMove.timestamp),
      };

      gameSession = (await this.gameSessionsService.updateOne(
        gameSession._id.toJSON(),
        updateFields,
      )) as GameSessionDocument;
    } catch (error) {
      throw new Error(
        `[GameEngineService.handlePlayerMove] : ERROR saving game session - ${error.message}`,
        { cause: error },
      );
    }

    return {
      boardState,
      gameSession,
    };
  }

  async _findOrCreateBoardState(
    gameSessionID: GameSessionDTO['id'],
  ): Promise<BoardStateDocument> {
    let boardState =
      await this.boardStatesService.findOneByGameSessionID(gameSessionID);

    if (boardState == null) {
      boardState = await this.boardStatesService.createOne({
        gameSessionID: gameSessionID,
      });
    }

    return boardState;
  }

  _handleMoveLogic(
    gameSession: GameSessionDocument,
    playerMove: PlayerMove,
  ): LogicSession {
    const logicSession = this.#gameLogicEngine.startGame({
      moves: gameSession.moves,
      playerOneID: gameSession.playerOneID,
      playerTwoID: gameSession.playerTwoID,
    });

    return this.#gameLogicEngine.handleMove({
      columnIndex: playerMove.columnIndex,
      playerID: playerMove.playerID,
      sessionRef: logicSession,
    });
  }
}
