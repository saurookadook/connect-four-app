import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import {
  type PlayerMove, // force formatting
} from '@connect-four-app/shared';
import { GameSessionDTO } from '@/game-engine/dtos';
import {
  BoardStateDocument,
  GameSessionDocument,
  NullableGameSessionDocument,
} from '@/game-engine/schemas';
import { GameLogicEngine, LogicSession } from '@/game-logic-engine';
import { BoardStatesService } from './board-states/board-states.service';
import { GameSessionsService } from './sessions/game-sessions.service';

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

    // TODO: populate BoardState with moves from GameSession

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
    const gameSession = await this.gameSessionsService.findOneById(
      playerMove.gameSessionID,
    );

    if (gameSession == null) {
      throw new NotFoundException(
        `[GameEngineService.handlePlayerMove] Game Session with ID '${playerMove.gameSessionID}' not found`,
      );
    }

    const boardState = await this._findOrCreateBoardState(
      playerMove.gameSessionID,
    );

    const logicSession = this._handleMoveLogic(gameSession, playerMove);

    try {
      boardState.cells = logicSession.board.gameBoardState;
      boardState.updatedAt = playerMove.timestamp;
      await boardState.save();
    } catch (error) {
      throw new Error(
        `[GameEngineService.handlePlayerMove] : ERROR saving board state - ${error.message}`,
        { cause: error },
      );
    }

    try {
      gameSession.moves.push(playerMove);
      gameSession.updatedAt = playerMove.timestamp;
      await gameSession.save();
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
