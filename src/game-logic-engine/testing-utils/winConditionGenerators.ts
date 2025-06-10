import { PlayerColor } from '@/game-logic-engine/constants';
import { LogicSession } from '@/game-logic-engine';

export function populateBoardWithOneMoveTilWin(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [3, PlayerColor.RED],
    [2, PlayerColor.BLACK],
    [2, PlayerColor.RED],
    [1, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [0, PlayerColor.RED],
    [3, PlayerColor.BLACK],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │(R)│   │   │   │   │   │   │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │ R │   │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ R │ R │ B │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ B │ B │ R │   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWinOne(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [3, PlayerColor.RED],
    [2, PlayerColor.BLACK],
    [2, PlayerColor.RED],
    [1, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [0, PlayerColor.RED],
    [3, PlayerColor.BLACK],
    [0, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │ B │(R)│   │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │ R │ R │ B │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ B │ B │ R │   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWinTwo(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [3, PlayerColor.RED],
    [2, PlayerColor.BLACK],
    [2, PlayerColor.RED],
    [1, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [0, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [0, PlayerColor.RED],
    [3, PlayerColor.BLACK],
    [1, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │ B │ R │(R)│ B │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ B │ B │ R │   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWinThree(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [3, PlayerColor.RED],
    [1, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [0, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [0, PlayerColor.RED],
    [3, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [2, PlayerColor.BLACK],
    [2, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │ B │ R │ B │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ R │ R │   │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │ B │ B │(R)│   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWinFour(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [0, PlayerColor.RED],
    [2, PlayerColor.BLACK],
    [2, PlayerColor.RED],
    [1, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [0, PlayerColor.BLACK],
    [0, PlayerColor.RED],
    [2, PlayerColor.BLACK],
    [3, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │   │   │   │   │   │   │(R)│ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │ R │ R │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ B │ R │ R │ B │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ R │ B │ B │ B │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithAscendingSlopeDiagonalWinOne(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [3, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [4, PlayerColor.RED],
    [5, PlayerColor.BLACK],
    [5, PlayerColor.RED],
    [6, PlayerColor.BLACK],
    [5, PlayerColor.RED],
    [6, PlayerColor.BLACK],
    [6, PlayerColor.RED],
    [3, PlayerColor.BLACK],
    [6, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │   │   │   │   │   │   │ R │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │(R)│ B │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ B │ R │ R │ R │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ R │ B │ B │ B │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithAscendingSlopeDiagonalWinTwo(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [3, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [4, PlayerColor.RED],
    [5, PlayerColor.BLACK],
    [5, PlayerColor.RED],
    [6, PlayerColor.BLACK],
    [6, PlayerColor.RED],
    [6, PlayerColor.BLACK],
    [6, PlayerColor.RED],
    [3, PlayerColor.BLACK],
    [5, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │   │   │   │   │   │   │ R │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │ R │ R │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ B │(R)│ R │ B │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ R │ B │ B │ B │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithAscendingSlopeDiagonalWinThree(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [3, PlayerColor.RED],
    [5, PlayerColor.BLACK],
    [5, PlayerColor.RED],
    [6, PlayerColor.BLACK],
    [6, PlayerColor.RED],
    [6, PlayerColor.BLACK],
    [6, PlayerColor.RED],
    [3, PlayerColor.BLACK],
    [5, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [4, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │   │   │   │   │   │   │ R │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ B │ R │ B │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ R │ R │ B │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │(R)│ B │ B │ R │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithAscendingSlopeDiagonalWinFour(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [6, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [4, PlayerColor.RED],
    [5, PlayerColor.BLACK],
    [5, PlayerColor.RED],
    [6, PlayerColor.BLACK],
    [5, PlayerColor.RED],
    [6, PlayerColor.BLACK],
    [6, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [3, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │   │   │   │(R)│   │   │   │
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
  const movesTuples: MoveTuple[] = [
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
 * @example
 * ```txt
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ B │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ B │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │(R)│ R │ R │ R │ B │   │   │
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithHorizontalWinOne(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [1, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [2, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [3, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [0, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ B │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ B │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │(R)│ R │ R │ B │   │   │
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithHorizontalWinTwo(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [0, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [2, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [3, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [1, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ B │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ B │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │ R │(R)│ R │ B │   │   │
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithHorizontalWinThree(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [0, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [3, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [2, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
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
 * │   │   │   │   │   │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ B │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ B │   │   │
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ R │ R │ R │(R)│ B │   │   │
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithHorizontalWinFour(
  logicSessionRef: LogicSession,
): void {
  const movesTuples: MoveTuple[] = [
    [0, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [1, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [2, PlayerColor.RED],
    [4, PlayerColor.BLACK],
    [3, PlayerColor.RED],
  ];

  populateBoardWithMoves({
    logicSessionRef,
    moves: movesTuples,
  });
}

export const winningConditionGeneratorFuncs = [
  populateBoardWithDescendingSlopeDiagonalWinOne,
  populateBoardWithDescendingSlopeDiagonalWinTwo,
  populateBoardWithDescendingSlopeDiagonalWinThree,
  populateBoardWithDescendingSlopeDiagonalWinFour,
  populateBoardWithAscendingSlopeDiagonalWinOne,
  populateBoardWithAscendingSlopeDiagonalWinTwo,
  populateBoardWithAscendingSlopeDiagonalWinThree,
  populateBoardWithAscendingSlopeDiagonalWinFour,
  populateBoardWithVerticalWin,
  populateBoardWithHorizontalWinOne,
  populateBoardWithHorizontalWinTwo,
  populateBoardWithHorizontalWinThree,
  populateBoardWithHorizontalWinFour,
];

/**
 * TEMPLATE
 * - winning move is surrounded by parens, such as (R) or (B)
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
export type MoveTuple = [number, PlayerColor];

export function populateBoardWithMoves({
  logicSessionRef,
  moves,
}: {
  logicSessionRef: LogicSession;
  moves: MoveTuple[];
}) {
  moves.forEach(([columnIndex, playerColor]) => {
    logicSessionRef.board.updateBoardState({
      columnIndex,
      playerColor,
    });
  });
}
