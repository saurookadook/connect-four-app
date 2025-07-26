import { type UUID } from 'node:crypto';
import {
  SEND_GAME_SESSION, // force formatting
  SEND_MOVE,
  GameSessionStatus,
} from '@/constants';

export type Nullable<T> = T | null;

export type BoardCell = {
  cellState: PlayerID | null;
  col: number;
  row: number;
};

export type BoardColumns = BoardCell[];
export type GameBoard = BoardColumns[];

export type PlayerID = UUID;

export type PlayerMove = {
  columnIndex: number;
  /** @note String representation of Mongo `ObjectId` */
  gameSessionID: string;
  playerID: PlayerID;
  /** @todo Need to change this to `number` */
  timestamp: Date;
};

export type BaseWebSocketMessageEvent<Data = any> = {
  event: string;
  data: Data;
};

export interface ActiveGameMessageEvent {
  /** @note String representation of Mongo `ObjectId` */
  id: string;
  boardCells: GameBoard;
  moves: PlayerMove[];
  playerOneID: PlayerID;
  playerTwoID: PlayerID;
  status: GameSessionStatus;
}

export interface SendGameSessionMessageEvent<ExtraData>
  extends BaseWebSocketMessageEvent {
  // prettier-ignore
  event: typeof SEND_GAME_SESSION;
  data: ExtraData extends object
    ? ExtraData & ActiveGameMessageEvent
    : ActiveGameMessageEvent;
}

export interface SendMoveMessageEvent<ExtraData>
  extends BaseWebSocketMessageEvent {
  // prettier-ignore
  event: typeof SEND_MOVE;
  data: ExtraData extends object
    ? ExtraData & ActiveGameMessageEvent
    : ActiveGameMessageEvent;
}
