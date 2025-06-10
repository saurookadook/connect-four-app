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

// TODO: better name...?
function playerHasCell({
  boardState, // force formatting
  colIndex,
  rowIndex,
  playerColor,
}: {
  boardState: GameBoard;
  colIndex: number;
  rowIndex: number;
  playerColor: PlayerColor;
}): boolean {
  return (
    !isBeyondBoardBounds(colIndex, rowIndex) &&
    boardState[colIndex][rowIndex].state === playerColor
  );
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
  loggingEnabled = false,
): boolean {
  let cell: Cell;

  localLogger(`checkTopDownVerticalWin for ${playerColor}`, loggingEnabled);
  for (let row = rowStart; row <= rowStart + 3; row++) {
    localLogger(`---- col: ${colStart} | row: ${row}`, loggingEnabled);
    if (isBeyondBoardBounds(colStart, row)) return false;

    cell = boardState[colStart][row];
    localLogger(`---- cell: ${JSON.stringify(cell)}`, loggingEnabled);
    if (cell.state !== playerColor) {
      return false;
    }
  }

  return true;
}

export function checkDescendingSlopeDiagonalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerColor: PlayerColor,
  loggingEnabled = false,
): boolean {
  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 0;

  localLogger(
    `checkDescendingSlopeDiagonalWin for ${playerColor}`,
    loggingEnabled,
  );
  for (let offset = 0; offset < 4; offset++) {
    localLogger(
      `---- Checking desc => col: ${colStart - offset} | row: ${rowStart - offset}`,
      loggingEnabled,
    );
    if (
      descOpen &&
      playerHasCell({
        boardState, // force formatting
        colIndex: colStart - offset,
        rowIndex: rowStart - offset,
        playerColor,
      })
    ) {
      connectedCount += 1;
    } else {
      descOpen = false;
    }

    localLogger(
      `---- Checking asc => col: ${colStart + offset} | row: ${rowStart + offset}`,
      loggingEnabled,
    );
    if (
      ascOpen &&
      playerHasCell({
        boardState, // force formatting
        colIndex: colStart + offset,
        rowIndex: rowStart + offset,
        playerColor,
      })
    ) {
      connectedCount += 1;
    } else {
      ascOpen = false;
    }

    if (connectedCount >= 4) {
      return true;
    }
  }

  return connectedCount >= 4;
}

export function checkAscendingSlopeDiagonalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerColor: PlayerColor,
  loggingEnabled = false,
): boolean {
  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 0;

  localLogger(
    `checkAscendingSlopeDiagonalWin for ${playerColor}`,
    loggingEnabled,
  );
  for (let offset = 0; offset < 4; offset++) {
    localLogger(
      `---- Checking desc => col: ${colStart - offset} | row: ${rowStart - offset}`,
      loggingEnabled,
    );
    if (
      descOpen &&
      playerHasCell({
        boardState, // force formatting
        colIndex: colStart - offset,
        rowIndex: rowStart + offset,
        playerColor,
      })
    ) {
      connectedCount += 1;
    } else {
      descOpen = false;
    }

    localLogger(
      `---- Checking asc => col: ${colStart + offset} | row: ${rowStart + offset}`,
      loggingEnabled,
    );
    if (
      ascOpen &&
      playerHasCell({
        boardState, // force formatting
        colIndex: colStart + offset,
        rowIndex: rowStart - offset,
        playerColor,
      })
    ) {
      connectedCount += 1;
    } else {
      ascOpen = false;
    }

    if (connectedCount >= 4) {
      return true;
    }
  }

  return connectedCount >= 4;
}

// TODO: combine logic in checkLeftToRightHorizontalWin and checkRightToLeftHorizontalWin
// into single function that checks for horizontal win
export function checkLeftToRightHorizontalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerColor: PlayerColor,
  loggingEnabled = false,
): boolean {
  let cell: Cell;

  localLogger(
    `checkLeftToRightHorizontalWin for ${playerColor}`,
    loggingEnabled,
  );
  for (let col = colStart; col <= colStart + 3; col++) {
    localLogger(`---- col: ${col} | row: ${rowStart}`, loggingEnabled);
    if (isBeyondBoardBounds(col, rowStart)) return false;

    cell = boardState[col][rowStart];
    localLogger(`---- cell: ${JSON.stringify(cell)}`, loggingEnabled);
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
  loggingEnabled = false,
): boolean {
  let cell: Cell;

  localLogger(
    `checkRightToLeftHorizontalWin for ${playerColor}`,
    loggingEnabled,
  );
  for (let col = colStart; col >= colStart - 3; col--) {
    localLogger(`---- col: ${col} | row: ${rowStart}`, loggingEnabled);
    if (isBeyondBoardBounds(col, rowStart)) return false;

    cell = boardState[col][rowStart];
    localLogger(`---- cell: ${JSON.stringify(cell)}`, loggingEnabled);
    if (cell.state !== playerColor) {
      return false;
    }
  }

  return true;
}

function localLogger(message: string, shouldLog = false) {
  if (shouldLog) {
    console.log(message);
  }
}

const validatorFuncs: ValidatorFunc[] = [
  checkTopDownVerticalWin,
  checkDescendingSlopeDiagonalWin,
  checkAscendingSlopeDiagonalWin,
  checkRightToLeftHorizontalWin,
  checkLeftToRightHorizontalWin,
];

export default validatorFuncs;
