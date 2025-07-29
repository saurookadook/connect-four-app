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

import {
  createFetchMock,
  expectHeadingToBeVisible,
  WithMemoryRouter,
} from '@/utils/testing';
import { AppStateProvider } from '@/store';

function MatchmakingWithRouter() {
  return <WithMemoryRouter initialEntries={['/matchmaking']} />;
}

describe('Matchmaking', () => {
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
      <MatchmakingWithRouter />, // force formatting
      AppStateProvider,
    );

    await expectHeadingToBeVisible({
      screenRef: screen,
      level: 2,
      name: /Matchmaking/,
    });
  });
});
