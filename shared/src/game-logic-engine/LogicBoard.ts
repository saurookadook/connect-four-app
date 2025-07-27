import {
  BOARD_COLS, // force formatting
  BOARD_ROWS,
} from '@/constants';
import { log as sharedLog } from '@/logger';
import {
  type BoardCell,
  type GameBoard,
  type Nullable,
  type PlayerID,
} from '@/types/main';
import { LogicSession } from './LogicSession';

const logger = sharedLog.getLogger('LogicBoard');
logger.setLevel('debug');

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

  // 0   1   2   3   4   5   6
  // ├───┼───┼───┼───┼───┼───┼───┤
  // │   │   │   │   │   │   │   │ 0
  // ├───┼───┼───┼───┼───┼───┼───┤
  // │   │   │   │   │   │   │   │ 1
  // ├───┼───┼───┼───┼───┼───┼───┤
  // │   │   │   │   │   │   │   │ 2
  // ├───┼───┼───┼───┼───┼───┼───┤
  // │ R │ R │   │   │   │   │   │ 3
  // ├───┼───┼───┼───┼───┼───┼───┤
  // │ B │ R │ R │ B │   │   │   │ 4
  // ├───┼───┼───┼───┼───┼───┼───┤
  // │ B │ B │ B │ R │   │   │   │ 5
  // └───┴───┴───┴───┴───┴───┴───┘
  printGameBoardState(): string {
    if (this.#logicSession == null) {
      logger.error('No logic session available to print game board state');
      return '';
    }

    const colorsByPlayer = {
      [this.#logicSession?.playerOneID]: 'R',
      [this.#logicSession?.playerTwoID]: 'B',
    };
    const fullCharWidth = 32;
    const displayLines: string[] = [];
    displayLines.push('  0   1   2   3   4   5   6');

    const middleDivider = '├───┼───┼───┼───┼───┼───┼───┤';

    displayLines.push(middleDivider);

    for (let rowIndex = 0; rowIndex < BOARD_ROWS; rowIndex++) {
      const rowCells = this.gameBoardState.map((col) => {
        const { cellState } = col[rowIndex] || {};
        return cellState != null && cellState in colorsByPlayer
          ? ` ${colorsByPlayer[cellState]} `
          : '   ';
      });
      const rowString = `|${rowCells.join('|')}| ${rowIndex}`;
      displayLines.push(rowString);
      if (rowIndex < BOARD_ROWS - 1) {
        displayLines.push(middleDivider);
      } else {
        displayLines.push('└───┴───┴───┴───┴───┴───┴───┘');
      }
    }

    const finalLines = displayLines.map((line) =>
      `\n ${line}`.padEnd(fullCharWidth, ' '),
    );
    logger.debug('\n', ...finalLines);

    return ['\n', ...finalLines].join('');
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
