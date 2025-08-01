import { GameSessionStatus } from '@/constants';
import { GameLogicEngine, LogicSession } from '@/game-logic-engine';
import { log as sharedLog } from '@/logger';
import { mockPlayerOneID, mockPlayerTwoID } from '@/mocks';
import {
  populateBoardWithOneMoveTilWin,
  populateBoardWithDescendingSlopeDiagonalWinOne,
  winningConditionGeneratorFuncs,
  type MoveTuple,
} from '@/utils/testing/winConditionGenerators';

const logger = sharedLog.getLogger('GameLogicEngine__Tests');

describe('GameLogicEngine', () => {
  let gameEngine: GameLogicEngine;

  beforeEach(() => {
    gameEngine = new GameLogicEngine();
  });

  describe('startGame', () => {
    test('creates a new game logic session with player IDs', () => {
      const newLogicSession = gameEngine.startGame({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });

      expect(newLogicSession).toBeDefined();
      expect(newLogicSession).toBeInstanceOf(LogicSession);
      expect(newLogicSession.playerOneID).toBe(mockPlayerOneID);
      expect(newLogicSession.playerTwoID).toBe(mockPlayerTwoID);
    });
  });

  describe('handleMove', () => {
    let logicSession: LogicSession;

    beforeEach(() => {
      logicSession = gameEngine.startGame({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
    });

    test("updates board state and active player for 'sessionRef'", () => {
      const {
        board: { gameBoardState },
      } = logicSession;
      const targetColIndex = 3;

      expect(gameBoardState[targetColIndex].at(-1)?.cellState).toBeNull();
      expect(logicSession.activePlayer).toBe(mockPlayerOneID);

      gameEngine.handleMove({
        columnIndex: targetColIndex,
        playerID: mockPlayerOneID,
        sessionRef: logicSession,
      });

      expect(gameBoardState[targetColIndex].at(-1)?.cellState).toBe(
        mockPlayerOneID,
      );
      expect(logicSession.activePlayer).toBe(mockPlayerTwoID);

      gameEngine.handleMove({
        columnIndex: targetColIndex,
        playerID: mockPlayerTwoID,
        sessionRef: logicSession,
      });

      expect(gameBoardState[targetColIndex].at(-2)?.cellState).toBe(
        mockPlayerTwoID,
      );
      expect(logicSession.activePlayer).toBe(mockPlayerOneID);
    });

    test("updates board state with winning move for 'sessionRef'", () => {
      populateBoardWithOneMoveTilWin(logicSession);

      const targetColIndex = 0;

      gameEngine.handleMove({
        columnIndex: targetColIndex,
        playerID: mockPlayerOneID,
        sessionRef: logicSession,
      });

      expect(
        logicSession.board.gameBoardState[targetColIndex].at(-4)?.cellState,
      ).toBe(mockPlayerOneID);
      expect(logicSession.activePlayer).toBe(mockPlayerOneID);
    });
  });

  describe('checkForWin', () => {
    describe('no win conditions', () => {
      let logicSession: LogicSession;

      beforeEach(() => {
        logicSession = gameEngine.startGame({
          playerOneID: mockPlayerOneID,
          playerTwoID: mockPlayerTwoID,
        });
      });

      test('simple case', () => {
        logicSession.board.updateBoardState({
          columnIndex: 3,
          playerID: mockPlayerOneID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 2,
          playerID: mockPlayerTwoID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 3,
          playerID: mockPlayerOneID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 3,
          playerID: mockPlayerTwoID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 4,
          playerID: mockPlayerOneID,
        });

        expect(gameEngine.checkForWin(logicSession.board)).toBe(false);
      });

      test('weird case', () => {
        logicSession.board.updateBoardState({
          columnIndex: 3,
          playerID: mockPlayerOneID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 4,
          playerID: mockPlayerTwoID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 2,
          playerID: mockPlayerOneID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 4,
          playerID: mockPlayerTwoID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 1,
          playerID: mockPlayerOneID,
        });

        expect(gameEngine.checkForWin(logicSession.board)).toBe(false);
      });

      test('another weird case', () => {
        const moveTuples = [
          [3, mockPlayerOneID],
          [4, mockPlayerTwoID],
          [3, mockPlayerOneID],
          [4, mockPlayerTwoID],
          [2, mockPlayerOneID],
          [3, mockPlayerTwoID],
          [1, mockPlayerOneID],
          [0, mockPlayerTwoID],
          [4, mockPlayerOneID],
          [4, mockPlayerTwoID],
        ] as MoveTuple[];

        moveTuples.forEach((moveTuple) => {
          const [columnIndex, playerID] = moveTuple;
          logicSession.board.updateBoardState({
            columnIndex,
            playerID,
          });
        });

        expect(gameEngine.checkForWin(logicSession.board)).toBe(false);
      });

      test('simple, weird case', () => {
        logicSession.board.updateBoardState({
          columnIndex: 3,
          playerID: mockPlayerOneID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 4,
          playerID: mockPlayerTwoID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 2,
          playerID: mockPlayerOneID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 3,
          playerID: mockPlayerTwoID,
        });
        logicSession.board.updateBoardState({
          columnIndex: 1,
          playerID: mockPlayerOneID,
        });

        expect(gameEngine.checkForWin(logicSession.board)).toBe(false);
      });

      test('complex case', () => {
        populateBoardWithOneMoveTilWin(logicSession);

        logicSession.board.printGameBoardState();

        expect(gameEngine.checkForWin(logicSession.board)).toBe(false);
      });
    });

    describe('win conditions', () => {
      let logicSession: LogicSession;

      beforeEach(() => {
        logicSession = gameEngine.startGame({
          playerOneID: mockPlayerOneID,
          playerTwoID: mockPlayerTwoID,
        });
      });

      const winningCases = winningConditionGeneratorFuncs.reduce(
        (acc, curr) => {
          acc.push([curr.name, curr]);
          return acc;
        },
        [] as [
          string, // testName
          (logicSessionRef: LogicSession) => void, // generatorFunc
        ][],
      );

      // test.only('DEBUGGING', () => {
      //   populateBoardWithDescendingSlopeDiagonalWinFive(logicSession);

      //   logger.debug(logicSession.board.printGameBoardState());

      //   expect(gameEngine.checkForWin(logicSession.board)).toBe(true);
      // });

      test.each(winningCases)('%s', (_, generatorFunc) => {
        generatorFunc(logicSession);

        expect(gameEngine.checkForWin(logicSession.board)).toBe(true);
      });
    });
  });

  describe('endGame', () => {
    test('correctly handles a game session with a winning condition', () => {
      const logicSession: LogicSession = gameEngine.startGame({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
      populateBoardWithDescendingSlopeDiagonalWinOne(logicSession);

      gameEngine.endGame(logicSession);

      expect(logicSession.status).toBe(GameSessionStatus.COMPLETED);
      expect(logicSession.activePlayer).toBe(mockPlayerOneID);
    });
  });
});
