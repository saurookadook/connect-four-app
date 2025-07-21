import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { type GameBoard } from '@connect-four-app/shared';
import { LogicBoard } from '@/game-logic-engine';

export const BOARD_STATES_TTL_SECONDS = 7200;

@Schema()
class Board_State {
  // NOTE: named with an `_` so that NestJS's Mongoose module creates the
  // collection as `board_states` instead of `boardstates`

  @Prop({
    ref: 'GameSession',
    type: Types.ObjectId,
  })
  gameSessionID: Types.ObjectId;

  @Prop({
    default: LogicBoard.createEmptyBoardState(),
  })
  cells: GameBoard;

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
  // gameSession: Types.Subdocument<Types.ObjectId> & GameSession
  gameSessionID: Types.ObjectId;
};

export type BoardStateDocument = HydratedDocument<
  Board_State,
  BoardStateDocumentOverride
>;

export type NullableBoardStateDocument = BoardStateDocument | null;

export const BoardStateSchema = SchemaFactory.createForClass(Board_State);
