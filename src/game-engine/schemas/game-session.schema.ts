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
export class GameSession {
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

export type GameSessionDocument = HydratedDocument<GameSession>;
export type NullableGameSessionDocument = GameSessionDocument | null;

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
