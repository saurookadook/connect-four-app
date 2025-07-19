import { mockPlayerOneID } from '@/__mocks__/playerMocks';
import { BOARD_COLS, BOARD_ROWS } from '../constants';
import { LogicBoard } from '..';

describe('Board', () => {
  let testLogicBoard: LogicBoard;

  describe("'updateBoardState' method", () => {
    test("updates cell state at '(col, row)' coordinate with player color", () => {
      testLogicBoard = new LogicBoard();

      const targetColIndex = 4;

      expect(
        testLogicBoard.gameBoardState[targetColIndex].at(-1)?.cellState,
      ).toBeNull();

      testLogicBoard.updateBoardState({
        columnIndex: targetColIndex,
        playerID: mockPlayerOneID,
      });

      expect(
        testLogicBoard.gameBoardState[targetColIndex].at(-1)?.cellState,
      ).toBe(mockPlayerOneID);
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
            cellState: null,
            col: colIndex,
            row: rowIndex,
          });
        });
      });
    });
  });
});
