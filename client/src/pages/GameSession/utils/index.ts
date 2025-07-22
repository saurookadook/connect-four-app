import {
  BOARD_COLS, // force formatting
  BOARD_ROWS,
  type GameBoard,
} from '@connect-four-app/shared';

export function createEmptyBoard() {
  const emptyBoard: GameBoard = new Array(BOARD_COLS);

  for (let i = 0; i < BOARD_COLS; i++) {
    emptyBoard[i] = [];

    for (let j = 0; j < BOARD_ROWS; j++) {
      emptyBoard[i][j] = {
        cellState: null,
        col: i,
        row: j,
      };
    }
  }

  return emptyBoard;
}

export * from './guards';
export * from './hooks';
