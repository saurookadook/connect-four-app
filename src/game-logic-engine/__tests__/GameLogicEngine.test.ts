import { UUID, randomUUID } from 'crypto';

import { GameLogicEngine, LogicSession } from '@/game-logic-engine';
import { GameSessionStatus, PlayerColor } from '@/game-logic-engine/constants';
import {
  populateBoardWithOneMoveTilWin,
  populateBoardWithDescendingSlopeDiagonalWinOne,
  winningConditionGeneratorFuncs,
} from '@/game-logic-engine/testing-utils/winConditionGenerators';

describe('GameLogicEngine', () => {
  const mockPlayerOneID: UUID = randomUUID();
  const mockPlayerTwoID: UUID = randomUUID();
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

      expect(gameBoardState[targetColIndex].at(-2)?.state).toBe(
        PlayerColor.BLACK,
      );
      expect(logicSession.activePlayer).toBe(PlayerColor.RED);
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
        logicSession.board.gameBoardState[targetColIndex].at(-4)?.state,
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
      populateBoardWithDescendingSlopeDiagonalWinOne(logicSession);

      gameEngine.endGame(logicSession);

      expect(logicSession.status).toBe(GameSessionStatus.COMPLETED);
      expect(logicSession.activePlayer).toBe(PlayerColor.RED);
    });
  });
});
