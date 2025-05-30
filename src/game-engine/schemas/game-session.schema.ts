import {
  // randomUUID,
  UUID,
} from 'node:crypto';
import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema } from 'mongoose';

import { GameSessionStatus, PlayerMove } from '@constants/game';

export const MoveSchema = new Schema({
  coordinates: { required: true, type: [Number] },
  playerID: { required: true, type: Schema.Types.UUID },
  timestamp: { required: true, type: Date },
});

export const GameSessionSchema = new Schema(
  {
    playerOneID: { type: Schema.Types.UUID, required: true },
    playerTwoID: { type: Schema.Types.UUID, required: true },
    moves: { default: [], type: [MoveSchema] },
    status: { enum: GameSessionStatus, type: String },
  },
  {
    timestamps: true,
  },
);

GameSessionSchema.pre('save', function () {
  console.log('[GameSessionSchema] - Pre-save hook triggered');
});

GameSessionSchema.post('save', function () {
  console.log('[GameSessionSchema] - Post-save hook triggered');
});

@NestSchema({
  // @ts-expect-error: This is the documented way to add an enum validator [https://mongoosejs.com/docs/api/schemastring.html#SchemaString.prototype.enum()]
  status: { enum: GameSessionStatus, type: String },
})
export class GameSession {
  @Prop({
    required: true,
    // type: randomUUID
  })
  playerOneID: Schema.Types.UUID;

  @Prop({
    required: true,
    // type: randomUUID
  })
  playerTwoID: Schema.Types.UUID;

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

export const NestGameSessionSchema = SchemaFactory.createForClass(GameSession);
