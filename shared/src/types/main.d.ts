import { type UUID } from 'node:crypto';

export type Nullable<T> = T | null;

export type PlayerID = UUID;

export type BoardCell = {
  cellState: PlayerID | null;
  col: number;
  row: number;
};

export type PlayerMove = {
  columnIndex: number;
  /** @note String representation of Mongo `ObjectId` */
  gameSessionID: string;
  playerID: PlayerID;
  /** @todo Need to change this to `number` */
  timestamp: Date;
};
