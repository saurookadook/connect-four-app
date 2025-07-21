import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import {
  GameSessionStatus,
  type PlayerID,
  type PlayerMove,
} from '@connect-four-app/shared';

@Schema({
  // @ts-expect-error: This is the documented way to add an enum validator [https://mongoosejs.com/docs/api/schemastring.html#SchemaString.prototype.enum()]
  status: { enum: GameSessionStatus, type: String },
})
class Game_Session {
  // NOTE: named with an `_` so that NestJS's Mongoose module creates the
  // collection as `game_sessions` instead of `gamesessions`

  @Prop({
    required: true,
    type: Types.UUID,
  })
  playerOneID: PlayerID;

  @Prop({
    required: true,
    type: Types.UUID,
  })
  playerTwoID: PlayerID;

  @Prop({
    default: null,
    type: Types.UUID,
  })
  winner: PlayerID;

  @Prop({ default: [], required: true })
  moves: PlayerMove[];

  @Prop({
    default: GameSessionStatus.ACTIVE,
    required: true,
    type: String,
  })
  status: GameSessionStatus; // e.g., 'ABANDONED', 'ACTIVE', 'COMPLETED'

  @Prop({ default: Date.now, required: true })
  createdAt: Date;

  @Prop({ default: Date.now, required: true })
  updatedAt: Date;
}

export { Game_Session as GameSession };

export type GameSessionDocument = HydratedDocument<Game_Session>;
export type NullableGameSessionDocument = GameSessionDocument | null;

export const GameSessionSchema = SchemaFactory.createForClass(Game_Session);
