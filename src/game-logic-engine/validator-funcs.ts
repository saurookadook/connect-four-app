import {
  BOARD_COLS,
  BOARD_ROWS,
  Cell,
  GameBoard,
  PlayerColor,
} from '@/game-logic-engine/constants';

export function isBeyondBoardBounds(
  col: number, // force formatting
  row: number,
) {
  return col < 0 || col >= BOARD_COLS || row < 0 || row >= BOARD_ROWS;
}

export type ValidatorFunc = (
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerColor: PlayerColor,
) => boolean;

export function checkTopDownVerticalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerColor: PlayerColor,
): boolean {
  let cell: Cell;

  console.log(`checkTopDownVerticalWin for ${playerColor}`);
  for (let row = rowStart; row <= rowStart + 3; row++) {
    console.log(`---- col: ${colStart} | row: ${row}`);
    if (isBeyondBoardBounds(colStart, row)) return false;

    cell = boardState[colStart][row];
    console.log(`---- cell: ${JSON.stringify(cell)}`);
    if (cell.state !== playerColor) {
      return false;
    }
  }

  return true;
}

export function checkTopDownLeftDiagonalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerColor: PlayerColor,
): boolean {
  let cell: Cell;
  let row = rowStart;

  console.log(`checkTopDownLeftDiagonalWin for ${playerColor}`);
  for (let col = colStart; col >= colStart - 3; col--) {
    console.log(`---- col: ${col} | row: ${row}`);
    if (isBeyondBoardBounds(col, row)) return false;

    cell = boardState[col][row];
    console.log(`---- cell: ${JSON.stringify(cell)}`);
    if (cell.state !== playerColor) {
      return false;
    }
    row++;
  }

  return true;
}

export function checkTopDownRightDiagonalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerColor: PlayerColor,
): boolean {
  let cell: Cell;
  let row = rowStart;

  console.log(`checkTopDownRightDiagonalWin for ${playerColor}`);
  for (let col = colStart; col <= colStart + 3; col++) {
    console.log(`---- col: ${col} | row: ${row}`);
    if (isBeyondBoardBounds(col, row)) return false;

    cell = boardState[col][row];
    console.log(`---- cell: ${JSON.stringify(cell)}`);
    if (cell.state !== playerColor) {
      return false;
    }
    row++;
  }

  return true;
}

export function checkLeftToRightHorizontalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerColor: PlayerColor,
): boolean {
  let cell: Cell;

  console.log(`checkLeftToRightHorizontalWin for ${playerColor}`);
  for (let col = colStart; col <= colStart + 3; col++) {
    console.log(`---- col: ${col} | row: ${rowStart}`);
    if (isBeyondBoardBounds(col, rowStart)) return false;

    cell = boardState[col][rowStart];
    console.log(`---- cell: ${JSON.stringify(cell)}`);
    if (cell.state !== playerColor) {
      return false;
    }
  }

  return true;
}

export function checkRightToLeftHorizontalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerColor: PlayerColor,
): boolean {
  let cell: Cell;

  console.log(`checkRightToLeftHorizontalWin for ${playerColor}`);
  for (let col = colStart; col >= colStart - 3; col--) {
    console.log(`---- col: ${col} | row: ${rowStart}`);
    if (isBeyondBoardBounds(col, rowStart)) return false;

    cell = boardState[col][rowStart];
    console.log(`---- cell: ${JSON.stringify(cell)}`);
    if (cell.state !== playerColor) {
      return false;
    }
  }

  return true;
}

const validatorFuncs: ValidatorFunc[] = [
  checkTopDownVerticalWin,
  checkTopDownLeftDiagonalWin,
  checkTopDownRightDiagonalWin,
  checkRightToLeftHorizontalWin,
  checkLeftToRightHorizontalWin,
];

export default validatorFuncs;
