import {
  BOARD_COLS, // force formatting
  BOARD_ROWS,
  type BoardCell,
  type GameBoard,
  type Nullable,
  type PlayerID,
} from '@connect-four-app/shared';
import { LogicSession } from './LogicSession';

export class LogicBoard {
  #logicSession: Nullable<LogicSession>;
  gameBoardState: GameBoard;
  lastUpdatedCell: Nullable<BoardCell>;

  constructor({
    gameBoardState,
    lastUpdatedCell,
    logicSession,
  }: {
    gameBoardState?: GameBoard;
    lastUpdatedCell?: BoardCell;
    logicSession?: LogicSession;
  } = {}) {
    // TODO: `gameBoardState` seems like an odd variable name; maybe it should accept something
    // like `PlayeyMoves[]` and construct the board from that?
    this.gameBoardState = gameBoardState || LogicBoard.createEmptyBoardState();
    this.lastUpdatedCell = lastUpdatedCell ?? null;
    this.#logicSession = logicSession ?? null;
  }

  updateBoardState({
    columnIndex,
    playerID,
  }: {
    columnIndex: number;
    playerID: PlayerID;
  }): GameBoard {
    if (columnIndex < 0 || columnIndex >= BOARD_COLS) {
      throw new Error(
        `Invalid 'columnIndex' value ('${columnIndex}'): Must be between 0 and ${BOARD_COLS - 1}`,
      );
    }

    const columnCells = this.gameBoardState[columnIndex];
    const rowIndex = columnCells.findLastIndex(
      (cell) => cell.cellState === null,
    );

    if (rowIndex === -1) {
      throw new Error(`Column ${columnIndex} is full`);
    }

    this.gameBoardState[columnIndex][rowIndex].cellState = playerID;
    this.lastUpdatedCell = this.gameBoardState[columnIndex][rowIndex];

    return this.gameBoardState;
  }

  reset(): void {
    this.gameBoardState = LogicBoard.createEmptyBoardState();
    this.lastUpdatedCell = null;
  }

  static createEmptyBoardState(): GameBoard {
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

  get logicSession(): Nullable<LogicSession> {
    return this.#logicSession;
  }

  set logicSession(value: unknown) {
    if (!(value instanceof LogicSession)) {
      throw new TypeError(
        `[LogicBoard.logicSession (setter)] : Assigned value must be an instance of 'LogicSession'`,
      );
    }

    this.#logicSession = value;
  }
}
