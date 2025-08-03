import { inspect } from 'node:util';
import renderWithContext from '#saurookkadookk/react-utils-render-with-context';
import { cleanup, screen, waitFor, within } from '@testing-library/react';
import {
  afterAll, // force formatting
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  test,
  vi,
} from 'vitest';

import {
  LogicSession,
  GameLogicEngine,
  moveTuplesByGenerator,
  populateBoardWithDescendingSlopeDiagonalWinOne,
  populateBoardWithOneMoveTilWin,
  populateBoardWithMoves,
  type PlayerMove,
  GameSessionStatus,
} from '@connect-four-app/shared';
import {
  findGameSessionMockForPlayers,
  type GameSessionMock,
} from '@/__mocks__/gameSessionsMocks';
import { server } from '@/__mocks__/mswServers';
import { mockFirstPlayer, mockSecondPlayer } from '@/__mocks__/playerMocks';
import { DEBUG_LS_KEY, GAME_SESSION_LS_KEY, PLAYER_DETAILS_LS_KEY } from '@/constants';
import { createEmptyBoard } from '@/pages/GameSession/utils';
import { AppStateProvider } from '@/store';
import {
  createFetchMock,
  expectGameBoardToBeVisibleAndCorrect,
  expectGameDetailsToBeVisibleAndCorrect,
  expectGameSessionDetailsToBeVisibleAndCorrect,
  expectHeadingToBeVisible,
  getGameSessionDetailsEl,
  WithMemoryRouter,
} from '@/utils/testing';

const mockGameSession = findGameSessionMockForPlayers({
  playerOneID: mockFirstPlayer.playerID,
  playerTwoID: mockSecondPlayer.playerID,
}) as GameSessionMock;
const emptyBoard = createEmptyBoard();

function GameSessionWithRouter({ gameSessionID }: { gameSessionID: string }) {
  return <WithMemoryRouter initialEntries={[`/game-session/${gameSessionID}`]} />;
}

describe('GameSession', () => {
  // @ts-expect-error: I know the type doesn't match exactly but that's ok :]
  const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(createFetchMock());
  window.localStorage.setItem(DEBUG_LS_KEY, JSON.stringify(true));
  window.localStorage.setItem(
    PLAYER_DETAILS_LS_KEY,
    JSON.stringify({
      playerID: mockFirstPlayer.playerID,
      username: mockFirstPlayer.username,
    }),
  );

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    cleanup();
    server.resetHandlers();
  });

  afterAll(() => {
    fetchMock.mockRestore();
    server.close();
    vi.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { container } = renderWithContext(
      <GameSessionWithRouter gameSessionID={mockGameSession.id} />, // force formatting
      AppStateProvider,
    );

    await expectHeadingToBeVisible({
      screenRef: screen,
      level: 2,
      name: /Connect Four/,
    });

    await expectGameSessionDetailsToBeVisibleAndCorrect({ containerRef: container });

    await expectGameDetailsToBeVisibleAndCorrect({
      containerRef: container,
      activePlayerID: mockGameSession.playerOneID,
      playerOneID: mockGameSession.playerOneID,
      playerOneUsername: mockGameSession.playerOneUsername,
      playerTwoID: mockGameSession.playerTwoID,
      playerTwoUsername: mockGameSession.playerTwoUsername,
    });

    await expectGameBoardToBeVisibleAndCorrect({
      containerRef: container,
      boardCells: emptyBoard,
      playerOneID: mockFirstPlayer.playerID,
      playerTwoID: mockSecondPlayer.playerID,
    });
  });

  test("alert is thrown when trying to move during other player's turn", async () => {
    /* START TEST SETUP */
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn());
    window.localStorage.setItem(
      PLAYER_DETAILS_LS_KEY,
      JSON.stringify({
        playerID: mockSecondPlayer.playerID,
        username: mockSecondPlayer.username,
      }),
    );

    const moveTuples = moveTuplesByGenerator[populateBoardWithOneMoveTilWin.name];

    const testMoves: PlayerMove[] = moveTuples.map((tuple) => {
      const [columnIndex, playerID] = tuple;
      return {
        columnIndex,
        gameSessionID: mockGameSession.id,
        playerID,
        timestamp: new Date(),
      };
    });
    let logicSession = new GameLogicEngine().startGame({
      playerOneID: mockFirstPlayer.playerID,
      playerTwoID: mockSecondPlayer.playerID,
    });
    logicSession = populateBoardWithMoves({
      logicSessionRef: logicSession,
      moves: moveTuples,
    });

    const { gameBoardState: testBoardCells } = logicSession.board;
    /* END TEST SETUP */

    const { container, user } = renderWithContext(
      <GameSessionWithRouter gameSessionID={mockGameSession.id} />, // force formatting
      AppStateProvider,
      {
        state: {
          gameSession: {
            gameSessionID: mockGameSession.id,
            boardCells: testBoardCells,
            moves: testMoves,
            playerOneID: mockFirstPlayer.playerID,
            playerOneUsername: mockFirstPlayer.username,
            playerTwoID: mockSecondPlayer.playerID,
            playerTwoUsername: mockSecondPlayer.username,
            status: GameSessionStatus.ACTIVE,
            winner: null,
          },
          player: {
            playerID: mockSecondPlayer.playerID,
          },
        },
      },
    );

    await expectHeadingToBeVisible({
      screenRef: screen,
      level: 2,
      name: /Connect Four/,
    });

    await expectGameSessionDetailsToBeVisibleAndCorrect({ containerRef: container });

    await expectGameDetailsToBeVisibleAndCorrect({
      containerRef: container,
      activePlayerID: mockFirstPlayer.playerID,
      playerOneID: mockFirstPlayer.playerID,
      playerOneUsername: mockFirstPlayer.username,
      playerTwoID: mockSecondPlayer.playerID,
      playerTwoUsername: mockSecondPlayer.username,
    });

    await expectGameBoardToBeVisibleAndCorrect({
      containerRef: container,
      boardCells: testBoardCells,
      playerOneID: mockFirstPlayer.playerID,
      playerTwoID: mockSecondPlayer.playerID,
    });

    const firstCellFromFirstColumn = container.querySelector(
      '.board-col-0 div.cell:first-child',
    ) as HTMLElement;
    await user.click(firstCellFromFirstColumn);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledExactlyOnceWith('No cheating! 🤪');
    });
  });

  test('alert is thrown when trying to move after game has been won', async () => {
    /* START TEST SETUP */
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(vi.fn());

    const moveTuples =
      moveTuplesByGenerator[populateBoardWithDescendingSlopeDiagonalWinOne.name];

    const testMoves: PlayerMove[] = moveTuples.map((tuple) => {
      const [columnIndex, playerID] = tuple;
      return {
        columnIndex,
        gameSessionID: mockGameSession.id,
        playerID,
        timestamp: new Date(),
      };
    });
    let logicSession = new GameLogicEngine().startGame({
      playerOneID: mockFirstPlayer.playerID,
      playerTwoID: mockSecondPlayer.playerID,
    });
    logicSession = populateBoardWithMoves({
      logicSessionRef: logicSession,
      moves: moveTuples,
    });

    const { gameBoardState: testBoardCells, lastUpdatedCell } = logicSession.board;
    /* END TEST SETUP */

    const { container, user } = renderWithContext(
      <GameSessionWithRouter gameSessionID={mockGameSession.id} />, // force formatting
      AppStateProvider,
      {
        state: {
          gameSession: {
            gameSessionID: mockGameSession.id,
            boardCells: testBoardCells,
            moves: testMoves,
            playerOneID: mockFirstPlayer.playerID,
            playerOneUsername: mockFirstPlayer.username,
            playerTwoID: mockSecondPlayer.playerID,
            playerTwoUsername: mockSecondPlayer.username,
            status: GameSessionStatus.COMPLETED,
            winner: mockFirstPlayer.playerID,
          },
          player: {
            playerID: mockSecondPlayer.playerID,
          },
        },
      },
    );

    await expectHeadingToBeVisible({
      screenRef: screen,
      level: 2,
      name: /Connect Four/,
    });

    await expectHeadingToBeVisible({
      screenRef: screen,
      level: 3,
      name: new RegExp(`Winner: '${mockFirstPlayer.username}'`),
    });

    await expectGameDetailsToBeVisibleAndCorrect({
      containerRef: container,
      activePlayerID: mockFirstPlayer.playerID,
      playerOneID: mockFirstPlayer.playerID,
      playerOneUsername: mockFirstPlayer.username,
      playerTwoID: mockSecondPlayer.playerID,
      playerTwoUsername: mockSecondPlayer.username,
    });

    await expectGameBoardToBeVisibleAndCorrect({
      containerRef: container,
      boardCells: testBoardCells,
      playerOneID: mockFirstPlayer.playerID,
      playerTwoID: mockSecondPlayer.playerID,
    });

    const firstCellFromFirstColumn = container.querySelector(
      '.board-col-0 div.cell:first-child',
    ) as HTMLElement;
    await user.click(firstCellFromFirstColumn);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledExactlyOnceWith(
        `Can't carry out move; the game has been won by '${mockFirstPlayer.username}'.`,
      );
    });
  });
});
