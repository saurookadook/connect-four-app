import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  BoardStateDTO,
  CreateBoardStateDTO,
  GameSessionDTO,
  UpdateBoardStateDTO,
} from '@/game-engine/dtos';
import {
  BoardState,
  BoardStateDocument,
  GameSession,
  NullableBoardStateDocument,
} from '@/game-engine/schemas';
import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';

@Injectable()
export class BoardStatesService {
  constructor(
    @InjectModel(BoardState.name)
    private boardStateModel: Model<BoardStateDocument>,
    private readonly gameSessionsService: GameSessionsService,
  ) {}

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
    if (boardState.gameSessionID != null) {
      await this._validateGameSession(boardState.gameSessionID);
    }

    return await this.boardStateModel // TODO: need to handle gameSessionID casting?
      .findByIdAndUpdate(id, boardState, { new: true })
      .exec();
  }

  async deleteOneByGameSessionID(
    gameSessionID: GameSessionDTO['id'],
  ): Promise<NullableBoardStateDocument> {
    return await this.boardStateModel
      .findOneAndDelete({ gameSessionID: new Types.ObjectId(gameSessionID) })
      .exec();
  }

  async _validateGameSession(gameSessionID: GameSessionDTO['id']) {
    const foundGameSession =
      await this.gameSessionsService.findOneById(gameSessionID);

    if (foundGameSession == null) {
      throw new NotFoundException(
        `[BoardStatesService._validateGameSession] Game Session with ID '${gameSessionID}' not found`,
      );
    }
  }
}
