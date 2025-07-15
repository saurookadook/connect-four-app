import {
  afterAll, // force formatting
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import renderWithContext from '#saurookkadookk/react-utils-render-with-context';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { allGameSessionsMock, GameSessionMock } from '@/__mocks__/gameSessionsMocks';
import { mockFirstPlayer, mockSecondPlayer } from '@/__mocks__/playerMocks';
import {
  GAME_SESSION_LS_KEY,
  PLAYER_DETAILS_LS_KEY,
} from '@/pages/GameSession/constants';
import { createEmptyBoard } from '@/pages/GameSession/utils';
import { AppStateProvider } from '@/store';
import { createFetchMock, WithMemoryRouter } from '@/utils/testing';

describe('GameSession', () => {
  // @ts-expect-error: I know the type doesn't match exactly but that's ok :]
  const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(createFetchMock());
  const mockGameSession = allGameSessionsMock.find((gameSession) => {
    return (
      gameSession.playerOneID === mockFirstPlayer.playerID &&
      gameSession.playerTwoID === mockSecondPlayer.playerID
    );
  }) as GameSessionMock;
  const emptyBoard = createEmptyBoard();
  window.localStorage.setItem(
    PLAYER_DETAILS_LS_KEY,
    JSON.stringify({ playerID: mockFirstPlayer.playerID }),
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    fetchMock.mockRestore();
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
      column.forEach((row, j) => {
        const boardCellEl = getBoardCell({
          containerRef: gameBoardContainerEl,
          columnIndex: i,
          rowIndex: j,
        });
        expect(boardCellEl).toBeVisible();
      });
    });
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
  columnIndex,
  rowIndex,
}: {
  containerRef: HTMLElement;
  columnIndex: number;
  rowIndex: number;
}): HTMLElement {
  return containerRef.querySelector(`#cell-${columnIndex}-${rowIndex}`) as HTMLElement;
}
