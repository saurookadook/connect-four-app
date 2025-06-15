import { BOARD_COLS, BOARD_ROWS, PlayerColor } from '../constants';
import { LogicBoard } from '..';

describe('Board', () => {
  let testLogicBoard: LogicBoard;

  describe("'updateBoardState' method", () => {
    test("updates cell state at '(col, row)' coordinate with player color", () => {
      testLogicBoard = new LogicBoard();

      const targetColIndex = 4;

      expect(
        testLogicBoard.gameBoardState[targetColIndex].at(-1)?.state,
      ).toBeNull();

      testLogicBoard.updateBoardState({
        columnIndex: targetColIndex,
        playerColor: PlayerColor.RED,
      });

      expect(testLogicBoard.gameBoardState[targetColIndex].at(-1)?.state).toBe(
        PlayerColor.RED,
      );
    });
  });

  describe("'createEmptyBoardState' static method", () => {
    test('creates a new empty board', () => {
      const emptyBoardColumns = LogicBoard.createEmptyBoardState();

      expect(emptyBoardColumns).toHaveLength(BOARD_COLS);

      emptyBoardColumns.forEach((row, colIndex) => {
        expect(row).toHaveLength(BOARD_ROWS);

        row.forEach((cell, rowIndex) => {
          expect(cell).toEqual({
            column: colIndex,
            row: rowIndex,
            state: null,
          });
        });
      });
    });
  });
});
