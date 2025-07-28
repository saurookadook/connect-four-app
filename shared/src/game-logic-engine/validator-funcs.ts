import { BOARD_COLS, BOARD_ROWS } from '@/constants';
import { log as sharedLog } from '@/logger';
import { type GameBoard, type PlayerID } from '@/types/main';

export type ValidatorFunc = (
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerID,
) => boolean;

export function checkVerticalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerID,
  loggingEnabled = false,
): boolean {
  const logger = sharedLog.getLogger(checkVerticalWin.name);
  if (!loggingEnabled) logger.setLevel('silent');

  let connectedCount = 1;

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
      logger.debug(
        `---- Checking vertical => increase count from ${connectedCount} to ${connectedCount + 1}`,
      );
      connectedCount += 1;
    }
  }

  logger.debug(
    `'checkVerticalWin' result for '${playerID}': ${playerHasWon(connectedCount)} (count: ${connectedCount})`,
  );
  return playerHasWon(connectedCount);
}

export function checkDescendingSlopeDiagonalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerID,
  loggingEnabled = false,
): boolean {
  const logger = sharedLog.getLogger(checkDescendingSlopeDiagonalWin.name);
  if (!loggingEnabled) logger.setLevel('silent');
  logger.setLevel('debug');

  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 1;

  logger.debug(`checkDescendingSlopeDiagonalWin for ${playerID}`);
  for (let offset = 1; offset < 4; offset++) {
    if (!descOpen && !ascOpen) {
      break;
    }

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
      logger.debug(
        `---- Checking desc => increase count from ${connectedCount} to ${connectedCount + 1}`,
      );
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
      logger.debug(
        `---- Checking asc => increase count from ${connectedCount} to ${connectedCount + 1}`,
      );
      connectedCount += 1;
    } else {
      ascOpen = false;
    }

    if (playerHasWon(connectedCount)) {
      logger.debug(
        `'checkDescendingSlopeDiagonalWin' result for '${playerID}': ${playerHasWon(connectedCount)} (count: ${connectedCount})`,
      );
      return true;
    }
  }

  return playerHasWon(connectedCount);
}

export function checkAscendingSlopeDiagonalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerID,
  loggingEnabled = false,
): boolean {
  const logger = sharedLog.getLogger(checkAscendingSlopeDiagonalWin.name);
  if (!loggingEnabled) logger.setLevel('silent');

  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 1;

  logger.debug(`checkAscendingSlopeDiagonalWin for ${playerID}`);
  for (let offset = 1; offset < 4; offset++) {
    if (!descOpen && !ascOpen) {
      break;
    }

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
      logger.debug(
        `---- Checking desc => increase count from ${connectedCount} to ${connectedCount + 1}`,
      );
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
      logger.debug(
        `---- Checking asc => increase count from ${connectedCount} to ${connectedCount + 1}`,
      );
      connectedCount += 1;
    } else {
      ascOpen = false;
    }

    if (playerHasWon(connectedCount)) {
      logger.debug(
        `'checkAscendingSlopeDiagonalWin' result for '${playerID}': ${playerHasWon(connectedCount)} (count: ${connectedCount})`,
      );
      return true;
    }
  }

  return playerHasWon(connectedCount);
}

export function checkHorizontalWin(
  boardState: GameBoard,
  colStart: number,
  rowStart: number,
  playerID: PlayerID,
  loggingEnabled = false,
): boolean {
  const logger = sharedLog.getLogger(checkHorizontalWin.name);
  if (!loggingEnabled) logger.setLevel('silent');

  let descOpen = true;
  let ascOpen = true;
  let connectedCount = 1;

  logger.debug(`checkHorizontalWin for ${playerID}`);
  for (let offset = 1; offset < 4; offset++) {
    if (!descOpen && !ascOpen) {
      break;
    }
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
      logger.debug(
        `---- Checking desc => increase count from ${connectedCount} to ${connectedCount + 1}`,
      );
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
      logger.debug(
        `---- Checking asc => increase count from ${connectedCount} to ${connectedCount + 1}`,
      );
      connectedCount += 1;
    } else {
      ascOpen = false;
    }

    if (playerHasWon(connectedCount)) {
      return true;
    }
  }

  logger.debug(
    `'checkHorizontalWin' result for '${playerID}': ${playerHasWon(connectedCount)} (count: ${connectedCount})`,
  );
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
  playerID: PlayerID;
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
