import { screen, waitFor, within } from '@testing-library/react';
import { expect } from 'vitest';

import { PlayerColor, type GameBoard, type PlayerID } from '@connect-four-app/shared';
import {
  getBoardCellEl,
  getGameBoardContainer,
  getGameDetailsEl,
  getGameSessionDetailsEl,
} from '../dom-element-getters';
import { expectHeadingToBeVisible } from './common';

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
  playerOneUsername,
  playerTwoID,
  playerTwoUsername,
}: {
  containerRef: HTMLElement;
  activePlayerID: PlayerID;
  playerOneID: PlayerID;
  playerOneUsername: string;
  playerTwoID: PlayerID;
  playerTwoUsername: string;
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
    const details =
      index === 0
        ? {
            suffix: `One (${PlayerColor.RED})`,
            username: playerOneUsername,
          }
        : {
            suffix: `Two (${PlayerColor.BLACK})`,
            username: playerTwoUsername,
          };

    expect(gameDetailsEl.querySelector(`dl dt.data-item-${index}`)).toHaveTextContent(
      `Player ${details.suffix}`,
    );
    expect(gameDetailsEl.querySelector(`dl dd.data-item-${index}`)).toHaveTextContent(
      details.username,
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

    expect(gameBoardContainerEl.querySelectorAll('.cell').length).toBeGreaterThan(0);
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
