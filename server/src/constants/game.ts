import { UUID } from 'node:crypto';

export enum GameSessionStatus {
  ABANDONED = 'ABANDONED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export type PlayersTuple = [UUID, UUID];

export type PlayerMove = {
  columnIndex: number;
  gameSessionID: UUID;
  playerID: UUID;
  /** @todo Need to change this to `number` */
  timestamp: Date;
};
