import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  BoardStateDTO,
  CreateBoardStateDTO,
  UpdateBoardStateDTO,
} from './dtos/board-states.dto';
import {
  BoardState,
  BoardStateDocument,
  NullableBoardStateDocument,
} from './schemas/board-states.schema';

@Injectable()
export class BoardStatesService {
  constructor(
    @InjectModel(BoardState.name)
    private boardStateModel: Model<BoardStateDocument>,
  ) {}

  async createOne(boardState: CreateBoardStateDTO) {}

  async findOneByGameSessionID(gameSessionID: BoardStateDTO['id']) {}

  async updateOne(id: string, boardState: UpdateBoardStateDTO) {}

  async deleteOneByGameSessionID(gameSessionID: BoardStateDTO['id']) {}
}
