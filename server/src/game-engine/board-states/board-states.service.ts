import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BOARD_COLS, BOARD_ROWS } from '@/game-logic-engine/constants';
import { BoardCell } from '@/types/main';

import {
  BoardState,
  BoardStateDocument,
  NullableBoardStateDocument,
} from '../schemas/board-states.schema';

@Injectable()
export class BoardStatesService {
  constructor(
    @InjectModel(BoardState.name)
    private boardStateModel: Model<BoardStateDocument>,
  ) {}
}
