import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import { BOARD_COLS, BOARD_ROWS } from '@/game-logic-engine/constants';
import { BoardCell } from '@/types/main';
import { GameSession } from './game-session.schema';

export function createEmptyBoard() {
  const board: BoardCell[][] = [];

  for (let i = 0; i < BOARD_COLS; i++) {
    board[i] = [];

    for (let j = 0; j < BOARD_ROWS; j++) {
      board[i][j] = {
        cellState: null,
        col: i,
        row: j,
      };
    }
  }

  return board;
}

export const BOARD_STATES_TTL_SECONDS = 7200;

@Schema()
class Board_State {
  // NOTE: named with an `_` so that NestJS's Mongoose module creates the
  // collection as `board_states` instead of `boardstates`

  @Prop({
    ref: 'GameSession',
    type: MongooseSchema.Types.ObjectId,
  })
  gameSessionID: MongooseSchema.Types.ObjectId;

  @Prop({
    default: createEmptyBoard(),
  })
  state: BoardCell[][];

  @Prop({
    default: Date.now,
    required: true,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
    required: true,
    index: { expires: BOARD_STATES_TTL_SECONDS },
    type: Date,
  })
  updatedAt: Date;
}

export { Board_State as BoardState };

export type BoardStateDocumentOverride = {
  gameSession: Types.Subdocument<Types.ObjectId> & GameSession;
};

export type BoardStateDocument = HydratedDocument<
  Board_State,
  BoardStateDocumentOverride
>;

export type NullableBoardStateDocument = BoardStateDocument | null;

export const BoardStateSchema = SchemaFactory.createForClass(Board_State);
