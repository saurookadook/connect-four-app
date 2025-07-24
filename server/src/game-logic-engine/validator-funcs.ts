import {
  BOARD_COLS, // force formatting
  BOARD_ROWS,
  sharedLog,
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
  const logger = sharedLog.getLogger(checkVerticalWin.name);
  if (!loggingEnabled) logger.setLevel('silent');

  let connectedCount = 0;

  logger.debug(`checkVerticalWin for ${playerID}`);
  for (let row = rowStart; row <= rowStart + 3; row++) {
    logger.debug(`---- Checking vertical => col: ${colStart} | row: ${row}`);

    if (
      cellIsOccupiedByPlayer({
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
  const logger = sharedLog.getLogger(checkDescendingSlopeDiagonalWin.name);
  if (!loggingEnabled) logger.setLevel('silent');

  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 0;

  logger.debug(`checkDescendingSlopeDiagonalWin for ${playerID}`);
  for (let offset = 0; offset < 4; offset++) {
    logger.debug(
      `---- Checking desc => col: ${colStart - offset} | row: ${rowStart - offset}`,
    );
    if (
      descOpen &&
      cellIsOccupiedByPlayer({
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

    logger.debug(
      `---- Checking asc => col: ${colStart + offset} | row: ${rowStart + offset}`,
    );
    if (
      ascOpen &&
      cellIsOccupiedByPlayer({
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
  const logger = sharedLog.getLogger(checkAscendingSlopeDiagonalWin.name);
  if (!loggingEnabled) logger.setLevel('silent');

  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 0;

  logger.debug(`checkAscendingSlopeDiagonalWin for ${playerID}`);
  for (let offset = 0; offset < 4; offset++) {
    logger.debug(
      `---- Checking desc => col: ${colStart - offset} | row: ${rowStart - offset}`,
    );
    if (
      descOpen &&
      cellIsOccupiedByPlayer({
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

    logger.debug(
      `---- Checking asc => col: ${colStart + offset} | row: ${rowStart + offset}`,
    );
    if (
      ascOpen &&
      cellIsOccupiedByPlayer({
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
  const logger = sharedLog.getLogger(checkHorizontalWin.name);
  if (!loggingEnabled) logger.setLevel('silent');

  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 0;

  logger.debug(`checkHorizontalWin for ${playerID}`);
  for (let offset = 0; offset < 4; offset++) {
    logger.debug(
      `---- Checking desc => col: ${colStart - offset} | row: ${rowStart}`,
    );
    if (
      descOpen &&
      cellIsOccupiedByPlayer({
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

    logger.debug(
      `---- Checking asc => col: ${colStart + offset} | row: ${rowStart}`,
    );
    if (
      ascOpen &&
      cellIsOccupiedByPlayer({
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
function cellIsOccupiedByPlayer({
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

export default validatorFuncs;
