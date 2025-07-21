import {
  BOARD_COLS, // force formatting
  BOARD_ROWS,
  type GameBoard,
} from '@connect-four-app/shared';
import { PlayerDTO } from '@/player/dtos/player.dto';

export type ValidatorFunc = (
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerDTO['playerID'],
) => boolean;

export function checkVerticalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerDTO['playerID'],
  loggingEnabled = false,
): boolean {
  let connectedCount = 0;

  localLogger(`checkVerticalWin for ${playerID}`, loggingEnabled);
  for (let row = rowStart; row <= rowStart + 3; row++) {
    localLogger(
      `---- Checking vertical => col: ${colStart} | row: ${row}`,
      loggingEnabled,
    );

    if (
      playerHasCell({
        boardState, // force formatting
        colIndex: colStart,
        rowIndex: row,
        playerID,
      })
    ) {
      connectedCount += 1;
    }
  }

  return playerHasWon(connectedCount);
}

export function checkDescendingSlopeDiagonalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerDTO['playerID'],
  loggingEnabled = false,
): boolean {
  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 0;

  localLogger(
    `checkDescendingSlopeDiagonalWin for ${playerID}`,
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
        playerID,
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
        playerID,
      })
    ) {
      connectedCount += 1;
    } else {
      ascOpen = false;
    }

    if (playerHasWon(connectedCount)) {
      return true;
    }
  }

  return playerHasWon(connectedCount);
}

export function checkAscendingSlopeDiagonalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerDTO['playerID'],
  loggingEnabled = false,
): boolean {
  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 0;

  localLogger(`checkAscendingSlopeDiagonalWin for ${playerID}`, loggingEnabled);
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
        playerID,
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
        playerID,
      })
    ) {
      connectedCount += 1;
    } else {
      ascOpen = false;
    }

    if (playerHasWon(connectedCount)) {
      return true;
    }
  }

  return playerHasWon(connectedCount);
}

export function checkHorizontalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerDTO['playerID'],
  loggingEnabled = false,
): boolean {
  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 0;

  localLogger(`checkHorizontalWin for ${playerID}`, loggingEnabled);
  for (let offset = 0; offset < 4; offset++) {
    localLogger(
      `---- Checking desc => col: ${colStart - offset} | row: ${rowStart}`,
      loggingEnabled,
    );
    if (
      descOpen &&
      playerHasCell({
        boardState,
        colIndex: colStart - offset,
        rowIndex: rowStart,
        playerID,
      })
    ) {
      connectedCount += 1;
    } else {
      descOpen = false;
    }

    localLogger(
      `---- Checking asc => col: ${colStart + offset} | row: ${rowStart}`,
      loggingEnabled,
    );
    if (
      ascOpen &&
      playerHasCell({
        boardState,
        colIndex: colStart + offset,
        rowIndex: rowStart,
        playerID,
      })
    ) {
      connectedCount += 1;
    } else {
      ascOpen = false;
    }

    if (playerHasWon(connectedCount)) {
      return true;
    }
  }

  return playerHasWon(connectedCount);
}

const validatorFuncs: ValidatorFunc[] = [
  checkVerticalWin,
  checkDescendingSlopeDiagonalWin,
  checkAscendingSlopeDiagonalWin,
  checkHorizontalWin,
];

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
  playerID,
}: {
  boardState: GameBoard;
  colIndex: number;
  rowIndex: number;
  playerID: PlayerDTO['playerID'];
}): boolean {
  return (
    !isBeyondBoardBounds(colIndex, rowIndex) &&
    boardState[colIndex][rowIndex].cellState === playerID
  );
}

function playerHasWon(connectedCount: number): boolean {
  return connectedCount >= 4;
}

function localLogger(message: string, shouldLog = false) {
  if (shouldLog) {
    console.log(message);
  }
}

export default validatorFuncs;
