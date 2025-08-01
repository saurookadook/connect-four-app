import { cleanup, screen, waitFor, within } from '@testing-library/react';
import renderWithContext from '#saurookkadookk/react-utils-render-with-context';
import {
  afterAll, // force formatting
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { mockPlayers } from '@/__mocks__/playerMocks';
import { PLAYER_DETAILS_LS_KEY } from '@/constants';
import { createEmptyBoard } from '@/pages/GameSession/utils';
import { AppStateProvider } from '@/store';
import {
  createFetchMock,
  expectGameBoardToBeVisibleAndCorrect,
  expectHeadingToBeVisible,
  expectMatchmakingPageToBeVisibleAndCorrect,
  getMatchmakingContainer,
  WithMemoryRouter,
} from '@/utils/testing';

const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;

function MatchmakingWithRouter() {
  return <WithMemoryRouter initialEntries={['/matchmaking']} />;
}

describe('Matchmaking', () => {
  // @ts-expect-error: I know the type doesn't match exactly but that's ok :]
  const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(createFetchMock());
  window.localStorage.setItem(
    PLAYER_DETAILS_LS_KEY,
    JSON.stringify({
      playerID: mockSecondPlayer.playerID,
      username: mockSecondPlayer.username,
    }),
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    fetchMock.mockRestore();
    vi.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { container } = renderWithContext(
      <MatchmakingWithRouter />, // force formatting
      AppStateProvider,
      {
        state: {
          player: {
            playerID: mockSecondPlayer.playerID,
            username: mockSecondPlayer.username,
          },
        },
      },
    );

    await expectMatchmakingPageToBeVisibleAndCorrect({
      screenRef: screen,
      containerRef: container,
      testPlayersData: [mockFirstPlayer, mockThirdPlayer],
    });
  });

  it("correctly starts a new game when clicking the challenge button next to a player's username", async () => {
    const { container, user } = renderWithContext(
      <MatchmakingWithRouter />, // force formatting
      AppStateProvider,
      {
        state: {
          player: {
            playerID: mockSecondPlayer.playerID,
            username: mockSecondPlayer.username,
          },
        },
      },
    );

    await expectMatchmakingPageToBeVisibleAndCorrect({
      screenRef: screen,
      containerRef: container,
      testPlayersData: [mockFirstPlayer, mockThirdPlayer],
    });

    const { playerID: playerTwoID, username: playerTwoUsername } = mockFirstPlayer;
    const matchmakingContainerEl = getMatchmakingContainer(container);
    const playerListItem = within(matchmakingContainerEl)
      .getByText(`${playerTwoUsername} ('${playerTwoID}')`, {
        exact: false,
      })
      .closest('li') as HTMLLIElement;

    await user.click(within(playerListItem).getByRole('button'));

    await expectHeadingToBeVisible({
      screenRef: screen,
      level: 2,
      name: /Connect Four/,
    });

    await expectGameBoardToBeVisibleAndCorrect({
      containerRef: container,
      boardCells: createEmptyBoard(),
      playerOneID: mockSecondPlayer.playerID,
      playerTwoID: playerTwoID,
    });
  });
});
