import { UUID } from 'node:crypto';

export enum GameSessionStatus {
  ABANDONED = 'ABANDONED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export type PlayersTuple = [UUID, UUID];
export type MoveCoordinatesTuple = [number, number];

export type PlayerMove = {
  coordinates: MoveCoordinatesTuple;
  playerID: UUID;
  timestamp: Date;
};
