import { UUID } from 'node:crypto';

export enum GameSessionStatus {
  ABANDONED = 'ABANDONED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export type PlayersTuple = [UUID, UUID];

export type PlayerMove = {
  columnIndex: number;
  playerID: UUID;
  timestamp: Date;
};
