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

import { mockPlayers } from '@/__mocks__/playerMocks';
import { PLAYER_DETAILS_LS_KEY } from '@/constants';
import { AppStateProvider } from '@/store';
import {
  createFetchMock,
  expectHeadingToBeVisible,
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

  afterAll(() => {
    fetchMock.mockRestore();
    vi.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { container, getByRole } = renderWithContext(
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

    await expectHeadingToBeVisible({
      screenRef: screen,
      level: 2,
      name: /Matchmaking/,
    });

    await waitFor(() => {
      expect(getByRole('list')).toBeVisible();
    });

    const matchmakingContainerEl = // force formatting
      container.querySelector('#matchmaking') as HTMLSelectElement;

    const playerListItemEls =
      await within(matchmakingContainerEl).findAllByRole('listitem');

    expect(playerListItemEls).toHaveLength(2);
    [mockFirstPlayer, mockThirdPlayer].forEach((expectedPlayer, index) => {
      const listItemEl = playerListItemEls[index];

      expect(listItemEl).toBeVisible();

      const { playerID, username } = expectedPlayer;
      const playerTextEl = within(listItemEl).getByText(`${username} ('${playerID}')`, {
        exact: false,
      });
      expect(playerTextEl).toBeVisible();
    });
  });
});
