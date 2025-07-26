import renderWithContext from '#saurookkadookk/react-utils-render-with-context';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  afterAll, // force formatting
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { type BoardCell } from '@connect-four-app/shared';
import { allGameSessionsMock, GameSessionMock } from '@/__mocks__/gameSessionsMocks';
import { server } from '@/__mocks__/mswServers';
import { mockFirstPlayer, mockSecondPlayer } from '@/__mocks__/playerMocks';
import { DEBUG_LS_KEY, GAME_SESSION_LS_KEY, PLAYER_DETAILS_LS_KEY } from '@/constants';
import { createEmptyBoard } from '@/pages/GameSession/utils';
import { AppStateProvider } from '@/store';
import { createFetchMock, WithMemoryRouter } from '@/utils/testing';

const mockGameSession = allGameSessionsMock.find((gameSession) => {
  return (
    gameSession.playerOneID === mockFirstPlayer.playerID &&
    gameSession.playerTwoID === mockSecondPlayer.playerID
  );
}) as GameSessionMock;
const emptyBoard = createEmptyBoard();

describe('GameSession', () => {
  // @ts-expect-error: I know the type doesn't match exactly but that's ok :]
  const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(createFetchMock());
  window.localStorage.setItem(DEBUG_LS_KEY, JSON.stringify(true));
  window.localStorage.setItem(
    PLAYER_DETAILS_LS_KEY,
    JSON.stringify({ playerID: mockFirstPlayer.playerID }),
  );

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
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

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Connect Four/,
      }),
    ).toBeVisible();

    let gameSessionDetailsEl: HTMLElement;
    let gameBoardContainerEl: HTMLElement;

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

    await waitFor(() => {
      gameBoardContainerEl = getGameBoardContainer(container);
      expect(gameBoardContainerEl).not.toBeNull();
      expect(gameBoardContainerEl).not.toBeEmptyDOMElement();
    });

    emptyBoard.forEach((column, i) => {
      column.forEach((rowCell, j) => {
        const boardCellEl = getBoardCell({
          containerRef: gameBoardContainerEl,
          boardCellRef: {
            cellState: rowCell.cellState,
            col: i,
            row: j,
          },
        });
        expect(boardCellEl).toBeVisible();
      });
    });
  });

  test.skip("alert is thrown when trying to move during other player's turn", async () => {
    const { container } = renderWithContext(
      <GameSessionWithRouter gameSessionID={mockGameSession.id} />, // force formatting
      AppStateProvider,
      {
        player: {
          playerID: mockSecondPlayer.playerID,
        },
      },
    );
  });
});

function GameSessionWithRouter({ gameSessionID }: { gameSessionID: string }) {
  return <WithMemoryRouter initialEntries={[`/game-session/${gameSessionID}`]} />;
}

function getGameSessionDetails(containerRef: HTMLElement): HTMLElement {
  return containerRef.querySelector(
    '#game-session .game-session-details',
  ) as HTMLElement;
}

function getGameBoardContainer(containerRef: HTMLElement): HTMLElement {
  return containerRef.querySelector(
    '#game-session #game-board-container',
  ) as HTMLElement;
}

function getBoardCell({
  containerRef,
  boardCellRef,
}: {
  containerRef: HTMLElement;
  boardCellRef: BoardCell;
}): HTMLElement {
  const { cellState, col, row } = boardCellRef;
  return containerRef.querySelector(`#cell-${col}-${row}`) as HTMLElement;
}
