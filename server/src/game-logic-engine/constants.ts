import { GameSessionStatus } from '@/constants/game';
import { BoardCell } from '@/types/main';

export { GameSessionStatus, type BoardCell };

export enum PlayerColor {
  RED = 'RED',
  BLACK = 'BLACK',
}

export type BoardColumns = BoardCell[];
export type GameBoard = BoardColumns[];

export const BOARD_ROWS = 6;
export const BOARD_COLS = 7;
