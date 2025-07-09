import { GameSessionStatus } from '@/constants/game';

export { GameSessionStatus };

export enum PlayerColor {
  RED = 'RED',
  BLACK = 'BLACK',
}

export type CellState = PlayerColor | null;
export interface Cell {
  state: CellState;
  row: number;
  column: number;
}

export type BoardColumns = Cell[];
export type GameBoard = BoardColumns[];

export const BOARD_ROWS = 6;
export const BOARD_COLS = 7;
