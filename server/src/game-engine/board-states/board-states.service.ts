import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { GameLogicEngine, type GameBoard } from '@connect-four-app/shared';
import {
  CreateBoardStateDTO, // force formatting
  GameSessionDTO,
  UpdateBoardStateDTO,
} from '@/game-engine/dtos';
import {
  BoardState,
  BoardStateDocument,
  NullableBoardStateDocument,
  GameSessionDocument,
} from '@/game-engine/schemas';
import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';

type BoardStateUpdateFields = {
  gameSessionID: Types.ObjectId;
  cells?: GameBoard;
};

@Injectable()
export class BoardStatesService {
  readonly gameLogicEngine: GameLogicEngine;

  constructor(
    @InjectModel(BoardState.name)
    private boardStateModel: Model<BoardStateDocument>,
    private readonly gameSessionsService: GameSessionsService,
  ) {
    this.gameLogicEngine = new GameLogicEngine();
  }

  async createOne(
    boardState: CreateBoardStateDTO,
  ): Promise<BoardStateDocument> {
    await this._validateGameSession(boardState.gameSessionID);

    // TODO: populate `state` from `moves`

    const { gameSessionID, ...rest } = boardState;
    const createdBoardState = new this.boardStateModel({
      ...rest,
      gameSessionID: new Types.ObjectId(gameSessionID),
    });
    return createdBoardState.save();
  }

  // TODO: add `findOrCreate` method

  async findOneByGameSessionID(
    gameSessionID: GameSessionDTO['id'],
  ): Promise<NullableBoardStateDocument> {
    await this._validateGameSession(gameSessionID);

    return await this.boardStateModel
      .findOne({ gameSessionID: new Types.ObjectId(gameSessionID) })
      .exec();
  }

  async updateOne(
    id: string,
    boardState: UpdateBoardStateDTO,
  ): Promise<NullableBoardStateDocument> {
    const foundBoardState = await this.boardStateModel.findById(id).exec();

    if (foundBoardState == null) {
      throw new NotFoundException(
        `[BoardStatesService.updateOne] Board State with ID '${id}' not found`,
      );
    }

    const gameSession = await this._validateGameSession(
      boardState.gameSessionID,
    );

    const updateFields: BoardStateUpdateFields = {
      gameSessionID: new Types.ObjectId(boardState.gameSessionID),
    };
    const updatedCells = this.getUpdatedCellsForMove(boardState, gameSession);

    if (updatedCells != null) {
      updateFields.cells = updatedCells;
    }

    return await this.boardStateModel
      .findByIdAndUpdate(id, updateFields, { new: true })
      .exec();
  }

  async deleteOneByGameSessionID(
    gameSessionID: GameSessionDTO['id'],
  ): Promise<NullableBoardStateDocument> {
    return await this.boardStateModel
      .findOneAndDelete({ gameSessionID: new Types.ObjectId(gameSessionID) })
      .exec();
  }

  getUpdatedCellsForMove(
    boardStateDTORef: UpdateBoardStateDTO,
    gameSessionRef: GameSessionDocument,
  ) {
    if (
      gameSessionRef == null ||
      (boardStateDTORef.move == null && boardStateDTORef.cells == null)
    ) {
      return;
    }

    let logicSession = this.gameLogicEngine.startGame({
      moves: gameSessionRef.moves,
      playerOneID: gameSessionRef.playerOneID,
      playerTwoID: gameSessionRef.playerTwoID,
    });

    if (boardStateDTORef.cells != null) {
      logicSession.board.gameBoardState = boardStateDTORef.cells;
    }

    if (boardStateDTORef.move != null) {
      logicSession = this.gameLogicEngine.handleMove({
        columnIndex: boardStateDTORef.move.columnIndex,
        playerID: boardStateDTORef.move.playerID,
        sessionRef: logicSession,
      });
    }

    return logicSession.board.gameBoardState;
  }

  async _validateGameSession(
    gameSessionID: GameSessionDTO['id'],
  ): Promise<GameSessionDocument> {
    const foundGameSession =
      await this.gameSessionsService.findOneById(gameSessionID);

    if (foundGameSession == null) {
      throw new NotFoundException(
        `[BoardStatesService._validateGameSession] Game Session with ID '${gameSessionID}' not found`,
      );
    }

    return foundGameSession;
  }
}
