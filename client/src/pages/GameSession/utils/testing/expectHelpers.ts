import { waitFor, within, type Screen } from '@testing-library/react';
import { expect } from 'vitest';

import { PlayerColor, type GameBoard, type PlayerID } from '@connect-four-app/shared';
import {
  getBoardCellEl,
  getGameBoardContainer,
  getGameDetailsEl,
  getGameSessionDetailsEl,
} from './domElementGetters';

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

export async function expectGameSessionDetailsToBeVisibleAndCorrect({
  containerRef,
}: {
  containerRef: HTMLElement;
}) {
  let gameSessionDetailsEl: HTMLElement;

  await waitFor(() => {
    gameSessionDetailsEl = getGameSessionDetailsEl(containerRef);
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
    gameDetailsEl = getGameDetailsEl(containerRef);
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

export async function expectGameBoardToBeVisibleAndCorrect({
  containerRef,
  boardCells,
  playerOneID,
  playerTwoID,
}: {
  containerRef: HTMLElement;
  boardCells: GameBoard;
  playerOneID: PlayerID;
  playerTwoID: PlayerID;
}) {
  let gameBoardContainerEl: HTMLElement;

  await waitFor(() => {
    gameBoardContainerEl = getGameBoardContainer(containerRef);
    expect(gameBoardContainerEl).not.toBeNull();
    expect(gameBoardContainerEl).not.toBeEmptyDOMElement();
  });

  boardCells.forEach((column, i) => {
    column.forEach((rowCell, j) => {
      const boardCellEl = getBoardCellEl({
        containerRef: gameBoardContainerEl,
        boardCellRef: {
          cellState: rowCell.cellState,
          col: i,
          row: j,
        },
      });

      expect(boardCellEl).toBeVisible();
      if (rowCell.cellState == null) {
        expect(boardCellEl).not.toHaveClass('red', 'black');
      } else if (rowCell.cellState === playerOneID) {
        expect(boardCellEl).toHaveClass('red');
        expect(boardCellEl).not.toHaveClass('black');
      } else if (rowCell.cellState === playerTwoID) {
        expect(boardCellEl).not.toHaveClass('red');
        expect(boardCellEl).toHaveClass('black');
      }
    });
  });
}
