import { waitFor, within, type Screen } from '@testing-library/react';
import { expect } from 'vitest';

import type { MatchmakingPlayersData } from '@/types/main';
import { getMatchmakingContainer } from '@/utils/testing';
import { expectHeadingToBeVisible } from './common';

export async function expectMatchmakingPlayersDataToBeVisibleAndCorrect({
  containerRef,
  testPlayersData,
}: {
  containerRef: HTMLElement;
  testPlayersData: MatchmakingPlayersData[];
}) {
  const matchmakingContainerEl = getMatchmakingContainer(containerRef);

  const playerListItemEls =
    await within(matchmakingContainerEl).findAllByRole('listitem');

  expect(playerListItemEls).toHaveLength(testPlayersData.length);
  testPlayersData.forEach((expectedPlayer, index) => {
    const listItemEl = playerListItemEls[index];

    expect(listItemEl).toBeVisible();

    const { playerID, username } = expectedPlayer;
    const playerTextEl = within(listItemEl).getByText(`${username} ('${playerID}')`, {
      exact: false,
    });
    expect(playerTextEl).toBeVisible();
  });
}

export async function expectMatchmakingPageToBeVisibleAndCorrect({
  screenRef,
  containerRef,
  testPlayersData,
}: {
  screenRef: Screen;
  containerRef: HTMLElement;
  testPlayersData: MatchmakingPlayersData[];
}) {
  await expectHeadingToBeVisible({
    screenRef,
    level: 2,
    name: /Matchmaking/,
  });

  await waitFor(() => {
    expect(
      within(getMatchmakingContainer(containerRef)).getByRole('list'),
    ).toBeVisible();
  });

  await expectMatchmakingPlayersDataToBeVisibleAndCorrect({
    containerRef,
    testPlayersData,
  });
}
