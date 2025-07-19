import { Types } from 'mongoose';

import { PlayerDTO } from '@/player/dtos/player.dto';

export type BoardCell = {
  cellState: PlayerDetails['playerID'] | null;
  col: number;
  row: number;
};

export type PlayerDetails = {
  playerID: PlayerDTO['playerID'];
  playerObjectID: Types.ObjectId;
  username: PlayerDTO['username'];
};

export type PlayerMove = {
  columnIndex: number;
  /** @note String representation of Mongo `ObjectId` */
  gameSessionID: string;
  playerID: PlayerDTO['playerID'];
  /** @todo Need to change this to `number` */
  timestamp: Date;
};
