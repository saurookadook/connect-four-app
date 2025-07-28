import { type BoardCell } from '@connect-four-app/shared';

export function getGameDetailsEl(containerRef: HTMLElement): HTMLElement {
  return containerRef.querySelector('#game-session #game-details') as HTMLElement;
}

export function getGameSessionDetailsEl(containerRef: HTMLElement): HTMLElement {
  return containerRef.querySelector(
    '#game-session .game-session-details',
  ) as HTMLElement;
}

export function getGameBoardContainer(containerRef: HTMLElement): HTMLElement {
  return containerRef.querySelector(
    '#game-session #game-board-container',
  ) as HTMLElement;
}

export function getBoardCellEl({
  containerRef,
  boardCellRef,
}: {
  containerRef: HTMLElement;
  boardCellRef: BoardCell;
}): HTMLElement {
  const { cellState, col, row } = boardCellRef;
  return containerRef.querySelector(`#cell-${col}-${row}`) as HTMLElement;
}
