import {
  GameBoard, // force formatting
  BOARD_ROWS,
  BOARD_COLS,
} from '@/pages/GameSession/constants';

export function createEmptyBoard() {
  const emptyBoard: GameBoard = new Array(BOARD_COLS);

  for (let i = 0; i < BOARD_COLS; i++) {
    emptyBoard[i] = [];

    for (let j = 0; j < BOARD_ROWS; j++) {
      emptyBoard[i][j] = {
        state: null,
        column: i,
        row: j,
      };
    }
  }

  return emptyBoard;
}

export * from './hooks';
