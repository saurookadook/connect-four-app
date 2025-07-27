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
  type BoardCell,
  type PlayerMove,
  GameSessionStatus,
} from '@connect-four-app/shared';
import { allGameSessionsMock, GameSessionMock } from '@/__mocks__/gameSessionsMocks';
import { server } from '@/__mocks__/mswServers';
import { mockFirstPlayer, mockSecondPlayer } from '@/__mocks__/playerMocks';
import { DEBUG_LS_KEY, GAME_SESSION_LS_KEY, PLAYER_DETAILS_LS_KEY } from '@/constants';
import { createEmptyBoard } from '@/pages/GameSession/utils';
import { AppStateProvider } from '@/store';
import { createFetchMock, WithMemoryRouter } from '@/utils/testing';
import {
  expectGameBoardToBeVisibleAndCorrect,
  expectGameDetailsToBeVisibleAndCorrect,
  expectHeadingToBeVisible,
  getGameSessionDetails,
} from './utils/testing';

const testPlayerOneID = mockFirstPlayer.playerID;
const testPlayerTwoID = mockSecondPlayer.playerID;

const mockGameSession = allGameSessionsMock.find((gameSession) => {
  return (
    gameSession.playerOneID === testPlayerOneID &&
    gameSession.playerTwoID === testPlayerTwoID
  );
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

    let gameSessionDetailsEl: HTMLElement;

    await waitFor(() => {
      gameSessionDetailsEl = getGameSessionDetails(container);
      expect(gameSessionDetailsEl).not.toBeNull();
      expect(gameSessionDetailsEl).not.toBeEmptyDOMElement();
    });

    expect(
      // @ts-expect-error: This should go away once the test config is loaded correctly
      await within(gameSessionDetailsEl).findByText('Game Session ID', {
        exact: false,
      }),
    ).toBeVisible();

    expect(
      // @ts-expect-error: This should go away once the test config is loaded correctly
      await within(gameSessionDetailsEl).findByText('Player ID', { exact: false }),
    ).toBeVisible();

    await expectGameDetailsToBeVisibleAndCorrect({
      containerRef: container,
      activePlayerID: mockGameSession.playerOneID,
      playerOneID: mockGameSession.playerOneID,
      playerTwoID: mockGameSession.playerTwoID,
    });

    await expectGameBoardToBeVisibleAndCorrect({
      containerRef: container,
      boardCells: emptyBoard,
      playerOneID: testPlayerOneID,
      playerTwoID: testPlayerTwoID,
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
      playerOneID: testPlayerOneID,
      playerTwoID: testPlayerTwoID,
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
            playerOneID: testPlayerOneID,
            playerTwoID: testPlayerTwoID,
            status: GameSessionStatus.ACTIVE,
            winner: null,
          },
          player: {
            playerID: testPlayerTwoID,
          },
        },
      },
    );

    await expectHeadingToBeVisible({
      screenRef: screen,
      level: 2,
      name: /Connect Four/,
    });

    let gameSessionDetailsEl: HTMLElement;

    await waitFor(() => {
      gameSessionDetailsEl = getGameSessionDetails(container);
      expect(gameSessionDetailsEl).not.toBeNull();
      expect(gameSessionDetailsEl).not.toBeEmptyDOMElement();
    });

    expect(
      // @ts-expect-error: This should go away once the test config is loaded correctly
      await within(gameSessionDetailsEl).findByText('Game Session ID', {
        exact: false,
      }),
    ).toBeVisible();

    expect(
      // @ts-expect-error: This should go away once the test config is loaded correctly
      await within(gameSessionDetailsEl).findByText('Player ID', { exact: false }),
    ).toBeVisible();

    await expectGameBoardToBeVisibleAndCorrect({
      containerRef: container,
      boardCells: testBoardCells,
      playerOneID: testPlayerOneID,
      playerTwoID: testPlayerTwoID,
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
      playerOneID: testPlayerOneID,
      playerTwoID: testPlayerTwoID,
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
            playerOneID: testPlayerOneID,
            playerTwoID: testPlayerTwoID,
            status: GameSessionStatus.COMPLETED,
            winner: testPlayerOneID,
          },
          player: {
            playerID: testPlayerTwoID,
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
      name: new RegExp(`Winner: '${testPlayerOneID}'`),
    });

    let gameSessionDetailsEl: HTMLElement;

    await waitFor(() => {
      gameSessionDetailsEl = getGameSessionDetails(container);
      expect(gameSessionDetailsEl).not.toBeNull();
      expect(gameSessionDetailsEl).not.toBeEmptyDOMElement();
    });

    expect(
      // @ts-expect-error: This should go away once the test config is loaded correctly
      await within(gameSessionDetailsEl).findByText('Game Session ID', {
        exact: false,
      }),
    ).toBeVisible();

    expect(
      // @ts-expect-error: This should go away once the test config is loaded correctly
      await within(gameSessionDetailsEl).findByText('Player ID', { exact: false }),
    ).toBeVisible();

    await expectGameBoardToBeVisibleAndCorrect({
      containerRef: container,
      boardCells: testBoardCells,
      playerOneID: testPlayerOneID,
      playerTwoID: testPlayerTwoID,
    });

    const firstCellFromFirstColumn = container.querySelector(
      '.board-col-0 div.cell:first-child',
    ) as HTMLElement;
    await user.click(firstCellFromFirstColumn);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledExactlyOnceWith(
        `Can't carry out move; the game has been won by '${testPlayerOneID}'.`,
      );
    });
  });
});
