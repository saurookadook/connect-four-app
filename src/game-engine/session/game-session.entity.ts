import { Schema } from 'mongoose';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

import { GameSessionStatus } from '@constants/game';

// @Entity()
export class PlayerMove {
  @Column({ nullable: false })
  coordinates: [number, number];

  @Column({ nullable: false })
  playerID: Schema.Types.UUID;

  @Column({ nullable: false })
  timestamp: Date;
}

@Entity()
export class GameSession {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ nullable: false })
  playerOneID: Schema.Types.UUID;

  @Column({ nullable: false })
  playerTwoID: Schema.Types.UUID;

  @Column((type) => PlayerMove)
  moves: PlayerMove[];

  @Column({
    type: 'enum',
    enum: [
      GameSessionStatus.ABANDONED,
      GameSessionStatus.ACTIVE,
      GameSessionStatus.COMPLETED,
    ],
    default: GameSessionStatus.ACTIVE,
  })
  session: GameSessionStatus;

  @Column({ default: Date.now, nullable: false })
  createdAt: Date;

  @Column({ default: Date.now, nullable: false })
  updatedAt: Date;
}

export type NullableGameSession = GameSession | null;
