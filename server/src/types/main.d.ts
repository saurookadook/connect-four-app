import { UUID } from 'node:crypto';
import { Types } from 'mongoose';

export type PlayerDetails = {
  playerID: UUID;
  playerObjectID: Types.ObjectId;
  username: string;
};

export type BoardCell = {
  cellState: any;
  col: number;
  row: number;
};
