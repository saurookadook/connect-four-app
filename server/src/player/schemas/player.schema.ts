import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import type { PlayerID } from '@connect-four-app/shared';

@Schema()
export class Player {
  @Prop({
    required: true,
    type: Types.UUID,
  })
  playerID: PlayerID;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  username: string;

  // TODO: is there a setting to exclude this from `find` queries by default?
  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    type: String,
  })
  email?: string;

  @Prop({ default: Date.now, required: true })
  createdAt: Date;

  @Prop({ default: Date.now, required: true })
  updatedAt: Date;
}

export type PlayerDocument = HydratedDocument<Player>;
export type NullablePlayerDocument = PlayerDocument | null;

export const PlayerSchema = SchemaFactory.createForClass(Player);
