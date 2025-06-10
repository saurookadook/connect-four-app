import { UUID, randomUUID } from 'crypto';

import { GameLogicEngine, LogicSession } from '@/game-logic-engine';
import { GameSessionStatus, PlayerColor } from '@/game-logic-engine/constants';
import { winningConditionGeneratorFuncs } from '@/game-logic-engine/testing-utils/winConditionGenerators';

describe('GameLogicEngine', () => {
  const mockPlayerOneID: UUID = randomUUID();
  const mockPlayerTwoID: UUID = randomUUID();
  let gameEngine: GameLogicEngine;
  let logicSession: LogicSession;

  beforeEach(() => {
    gameEngine = new GameLogicEngine();
  });

  afterEach(() => {
    if (logicSession != null) {
      logicSession.board.reset();
    }
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
    beforeEach(() => {
      logicSession = gameEngine.startGame({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
    });

    // TODO: fix method implementation
    test.skip("updates board state and active player for 'sessionRef'", () => {
      const {
        board: { gameBoardState },
      } = logicSession;
      const targetColIndex = 3;

      expect(gameBoardState[targetColIndex].at(-1)?.state).toBeNull();
      expect(logicSession.activePlayer).toBe(PlayerColor.RED);

      gameEngine.handleMove({
        columnIndex: targetColIndex,
        playerID: mockPlayerOneID,
        sessionRef: logicSession,
      });

      expect(gameBoardState[targetColIndex].at(-1)?.state).toBe(
        PlayerColor.RED,
      );
      expect(logicSession.activePlayer).toBe(PlayerColor.BLACK);

      gameEngine.handleMove({
        columnIndex: targetColIndex,
        playerID: mockPlayerTwoID,
        sessionRef: logicSession,
      });

      expect(gameBoardState[targetColIndex].at(-1)?.state).toBe(
        PlayerColor.BLACK,
      );
      expect(logicSession.activePlayer).toBe(PlayerColor.RED);
    });

    // TODO: fix method implementation
    test.skip("updates board state with winning move for 'sessionRef'", () => {
      populateBoardWithOneMoveTilWin(logicSession);

      const targetColIndex = 0;

      gameEngine.handleMove({
        columnIndex: targetColIndex,
        playerID: mockPlayerOneID,
        sessionRef: logicSession,
      });

      expect(
        logicSession.board.gameBoardState[targetColIndex].at(-1)?.state,
      ).toBe(PlayerColor.RED);
      expect(logicSession.activePlayer).toBe(PlayerColor.RED);
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
          playerColor: PlayerColor.RED,
        });
        logicSession.board.updateBoardState({
          columnIndex: 2,
          playerColor: PlayerColor.BLACK,
        });
        logicSession.board.updateBoardState({
          columnIndex: 3,
          playerColor: PlayerColor.RED,
        });
        logicSession.board.updateBoardState({
          columnIndex: 3,
          playerColor: PlayerColor.BLACK,
        });
        logicSession.board.updateBoardState({
          columnIndex: 4,
          playerColor: PlayerColor.RED,
        });

        expect(
          gameEngine.checkForWin(logicSession.board, logicSession.activePlayer),
        ).toBe(false);
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

      test.each(winningCases)('%s', (_, generatorFunc) => {
        generatorFunc(logicSession);

        expect(
          gameEngine.checkForWin(logicSession.board, logicSession.activePlayer),
        ).toBe(true);
      });
    });
  });

  describe('endGame', () => {
    test('correctly handles a game session with a winning condition', () => {
      const logicSession: LogicSession = gameEngine.startGame({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
      populateBoardWithSimpleWin(logicSession);

      gameEngine.endGame(logicSession);

      expect(logicSession.status).toBe(GameSessionStatus.COMPLETED);
      expect(logicSession.activePlayer).toBe(PlayerColor.RED);
    });
  });
});

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------
function populateBoardWithOneMoveTilWin(logicSessionRef: LogicSession): void {
  // RED at (3, 0)
  logicSessionRef.board.updateBoardState({
    columnIndex: 3,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 2,
    playerColor: PlayerColor.BLACK,
  });
  // RED at (2, 1)
  logicSessionRef.board.updateBoardState({
    columnIndex: 2,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 1,
    playerColor: PlayerColor.BLACK,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 1,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 0,
    playerColor: PlayerColor.BLACK,
  });
  // RED at (1, 2)
  logicSessionRef.board.updateBoardState({
    columnIndex: 1,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 0,
    playerColor: PlayerColor.BLACK,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 0,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 3,
    playerColor: PlayerColor.BLACK,
  });
}

/**
 * @example
 * ```txt
 *   0   1   2   3   4   5   6
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │ 0
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │ 1
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │   │   │   │   │   │   │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │ R │   │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ R │ R │ B │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ B │ B │ R │   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
function populateBoardWithSimpleWin(logicSessionRef: LogicSession): void {
  populateBoardWithOneMoveTilWin(logicSessionRef);

  // RED at (0, 3)
  logicSessionRef.board.updateBoardState({
    columnIndex: 0,
    playerColor: PlayerColor.RED,
  });
}

/**
 * TEMPLATE
 * @example
 * ```txt
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
