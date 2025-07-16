import {
  // randomUUID,
  UUID,
} from 'node:crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { GameSessionStatus, PlayerMove } from '@constants/game';

@Schema({
  // @ts-expect-error: This is the documented way to add an enum validator [https://mongoosejs.com/docs/api/schemastring.html#SchemaString.prototype.enum()]
  status: { enum: GameSessionStatus, type: String },
})
class Game_Session {
  // NOTE: named with an `_` so that NestJS's Mongoose module creates the
  // collection as `game_sessions` instead of `gamesessions`

  @Prop({
    required: true,
    // type: randomUUID
  })
  playerOneID: UUID;

  @Prop({
    required: true,
    // type: randomUUID
  })
  playerTwoID: UUID;

  @Prop({
    default: null,
  })
  winner: UUID;

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
