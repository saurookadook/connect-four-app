export const BOARD_ROWS = 6;
export const BOARD_COLS = 7;

export enum GameSessionStatus {
  ABANDONED = 'ABANDONED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum PlayerColor {
  RED = 'RED',
  BLACK = 'BLACK',
}

export * from './validation-patterns';
export * from './ws-events';
