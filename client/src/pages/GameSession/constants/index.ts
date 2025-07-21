import type { BoardCell, PlayerID } from '@connect-four-app/shared';

export enum GameSessionStatus {
  ABANDONED = 'ABANDONED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum PlayerColor {
  RED = 'RED',
  BLACK = 'BLACK',
}

// TODO: are these still needed?
export type CellState = PlayerColor | null;
export interface Cell {
  state: CellState;
  row: number;
  column: number;
}

export type BoardColumns = BoardCell[];
export type GameBoard = BoardColumns[];

export const BOARD_ROWS = 6;
export const BOARD_COLS = 7;

export const GAME_SESSION_LS_KEY = 'cfGameSession';
export const PLAYER_DETAILS_LS_KEY = 'cfPlayerDetails';
