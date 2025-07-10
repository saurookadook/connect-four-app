import {
  afterAll, // force formatting
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import renderWithContext from '@saurookkadookk/react-utils-render-with-context';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createFetchMock, WithMemoryRouter } from '@/utils/testing';
import { AppStateProvider } from '@/store';

function GameSessionsHistoryWithRouter() {
  return <WithMemoryRouter initialEntries={['/game-sessions-history']} />;
}

function getHistoryItemResults(containerRef: HTMLElement) {
  return containerRef.querySelectorAll('.results-wrapper .game-session-history-item');
}

describe('GameSessionsHistory', () => {
  // @ts-expect-error: I know the type doesn't match exactly but that's ok :]
  const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(createFetchMock());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    fetchMock.mockRestore();
    vi.clearAllMocks();
  });

  it('renders correctly', async () => {
    const { container } = renderWithContext(
      <GameSessionsHistoryWithRouter />, // force formatting
      AppStateProvider,
    );

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Game Sessions History/,
      }),
    ).toBeVisible();

    const gameSessionsHistoryEl = container.querySelector('#game-sessions-history');

    let allGameSessionsEl;
    let playerHistoryEl;

    await waitFor(() => {
      allGameSessionsEl = gameSessionsHistoryEl!.querySelector('#all-game-sessions');
      expect(allGameSessionsEl).toBeVisible();

      playerHistoryEl = gameSessionsHistoryEl!.querySelector('#player-game-sessions');
      expect(playerHistoryEl).toBeVisible();
    });

    let allGameSessionsResults;

    await waitFor(() => {
      allGameSessionsResults = getHistoryItemResults(allGameSessionsEl!);
      expect(allGameSessionsResults.length).toBeGreaterThan(0);
    });

    // const playerHistoryResults = getHistoryItemResults(playerHistoryEl!);
    // expect(playerHistoryResults.length).toBeGreaterThan(0);
    expect(within(playerHistoryEl!).getByText('No Results', { exact: false })).toBeVisible();
    expect(
      within(playerHistoryEl!).getByText('Sorry for the inconvenience', { exact: false }),
    ).toBeVisible();
  });
});
