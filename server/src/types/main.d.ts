import { UUID } from 'node:crypto';
import { Types } from 'mongoose';

export type BoardCell = {
  cellState: PlayerDetails['playerID'] | null;
  col: number;
  row: number;
};

export type PlayerDetails = {
  playerID: UUID;
  playerObjectID: Types.ObjectId;
  username: string;
};

export type PlayerMove = {
  columnIndex: number;
  /** @note String representation of Mongo `ObjectId` */
  gameSessionID: string;
  playerID: UUID;
  /** @todo Need to change this to `number` */
  timestamp: Date;
};
