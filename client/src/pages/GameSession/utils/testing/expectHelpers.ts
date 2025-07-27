import { waitFor, within, type Screen } from '@testing-library/react';
import { expect } from 'vitest';

import { PlayerColor, type PlayerID } from '@connect-four-app/shared';
import { getGameDetails } from './domElementGetters';

export async function expectHeadingToBeVisible({
  screenRef,
  level = 2,
  name = /Connect Four/,
}: {
  screenRef: Screen;
  level?: number;
  name?: RegExp | string;
}) {
  const headingEl = await screenRef.findByRole('heading', {
    level,
    name,
  });

  expect(headingEl).toBeVisible();
}

export async function expectGameDetailsToBeVisibleAndCorrect({
  containerRef,
  activePlayerID,
  playerOneID,
  playerTwoID,
}: {
  containerRef: HTMLElement;
  activePlayerID: PlayerID;
  playerOneID: PlayerID;
  playerTwoID: PlayerID;
}) {
  let gameDetailsEl: HTMLElement;

  await waitFor(() => {
    gameDetailsEl = getGameDetails(containerRef);
    expect(gameDetailsEl).not.toBeNull();
    expect(gameDetailsEl).not.toBeEmptyDOMElement();
  });

  const activePlayerColor =
    activePlayerID === playerOneID ? PlayerColor.RED : PlayerColor.BLACK;

  await expectHeadingToBeVisible({
    // @ts-expect-error: This should go away once the test config is loaded correctly
    screenRef: within(gameDetailsEl),
    level: 3,
    name: new RegExp(`Active player: ${activePlayerColor}`),
  });

  [playerOneID, playerTwoID].forEach((playerID, index) => {
    const suffix =
      index === 0 ? `One (${PlayerColor.RED})` : `Two (${PlayerColor.BLACK})`;

    expect(gameDetailsEl.querySelector(`dl dt.data-item-${index}`)).toHaveTextContent(
      `Player ${suffix}`,
    );
    expect(gameDetailsEl.querySelector(`dl dd.data-item-${index}`)).toHaveTextContent(
      playerID,
    );
  });
}
