import { UUID } from 'node:crypto';
import { Types } from 'mongoose';

export type PlayerDetails = {
  playerID: UUID;
  playerObjectID: Types.ObjectId;
  username: string;
};

export type BoardCell = {
  cellState: PlayerDetails['playerID'] | null;
  col: number;
  row: number;
};
