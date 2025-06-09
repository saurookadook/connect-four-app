import { PlayerColor } from '@/game-logic-engine/constants';
import { LogicSession } from '@/game-logic-engine';

export function populateBoardWithOneMoveTilWin(
  logicSessionRef: LogicSession,
): void {
  // RED at (3, 0)
  logicSessionRef.board.updateBoardState({
    columnIndex: 3,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 2,
    playerColor: PlayerColor.BLACK,
  });
  // RED at (2, 1)
  logicSessionRef.board.updateBoardState({
    columnIndex: 2,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 1,
    playerColor: PlayerColor.BLACK,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 1,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 0,
    playerColor: PlayerColor.BLACK,
  });
  // RED at (1, 2)
  logicSessionRef.board.updateBoardState({
    columnIndex: 1,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 0,
    playerColor: PlayerColor.BLACK,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 0,
    playerColor: PlayerColor.RED,
  });
  logicSessionRef.board.updateBoardState({
    columnIndex: 3,
    playerColor: PlayerColor.BLACK,
  });
}

/**
 * @example
 * ```txt
 *   0   1   2   3   4   5   6
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │ 0
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │ 1
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │   │   │   │   │   │   │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │ R │   │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ R │ R │ B │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ B │ B │ R │   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWin(
  logicSessionRef: LogicSession,
): void {
  populateBoardWithOneMoveTilWin(logicSessionRef);

  // RED at (0, 3)
  logicSessionRef.board.updateBoardState({
    columnIndex: 0,
    playerColor: PlayerColor.RED,
  });
}

/**
 * @example
 * ```txt
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ R │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ R │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ R │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ B │ B │ R │   │   │   │
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithVerticalWin(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MovesTuple[] = [
    [3, PlayerColor.RED],
    [1, PlayerColor.BLACK],
    [3, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [3, PlayerColor.RED],
    [2, PlayerColor.BLACK],
    [0, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
  });
}

/**
 * TEMPLATE
 * @example
 * ```txt
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */

/** @description Tuple of `[columnIndex, PlayerColor]` */
export type MovesTuple = [number, PlayerColor];

export function populateBoardWithMoves({
  logicSessionRef,
  moves,
}: {
  logicSessionRef: LogicSession;
  moves: MovesTuple[];
}) {
  moves.forEach(([columnIndex, playerColor]) => {
    logicSessionRef.board.updateBoardState({
      columnIndex,
      playerColor,
    });
  });
}
