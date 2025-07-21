import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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
import { GameLogicEngine } from '@/game-logic-engine';

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
    this.handleUpdateForMove(boardState, gameSession);

    return await this.boardStateModel // TODO: need to handle gameSessionID casting?
      .findByIdAndUpdate(
        id,
        {
          ...boardState,
          gameSessionID: new Types.ObjectId(boardState.gameSessionID),
        },
        { new: true },
      )
      .exec();
  }

  async deleteOneByGameSessionID(
    gameSessionID: GameSessionDTO['id'],
  ): Promise<NullableBoardStateDocument> {
    return await this.boardStateModel
      .findOneAndDelete({ gameSessionID: new Types.ObjectId(gameSessionID) })
      .exec();
  }

  handleUpdateForMove(
    boardStateRef: UpdateBoardStateDTO,
    gameSessionRef: GameSessionDocument,
  ) {
    if (gameSessionRef == null || boardStateRef.move == null) {
      return;
    }

    let logicSession = this.gameLogicEngine.startGame({
      moves: gameSessionRef.moves,
      playerOneID: gameSessionRef.playerOneID,
      playerTwoID: gameSessionRef.playerTwoID,
    });
    logicSession = this.gameLogicEngine.handleMove({
      columnIndex: boardStateRef.move.columnIndex,
      playerID: boardStateRef.move.playerID,
      sessionRef: logicSession,
    });

    boardStateRef.state = logicSession.board.gameBoardState;
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
