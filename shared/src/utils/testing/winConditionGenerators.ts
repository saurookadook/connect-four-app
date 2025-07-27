import { LogicSession } from '@/game-logic-engine';
import { mockPlayerOneID, mockPlayerTwoID } from '@/mocks';
import { type PlayerID } from '@/types/main';

/**
 * @note Winning move is Red @ columnIndex 0
 * @example
 * ```txt
 *   0   1   2   3   4   5   6
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │ 0
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │ 1
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │   │   │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ r │ r │   │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ r │ r │ b │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ b │ b │ r │   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithOneMoveTilWin(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithOneMoveTilWin.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
 * │(r)│   │   │   │   │   │   │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ r │ r │   │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ r │ r │ b │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ b │ b │ r │   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWinOne(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithDescendingSlopeDiagonalWinOne.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
 * │ r │   │   │   │   │   │   │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │(r)│   │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ r │ r │ r │ b │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ b │ b │ r │   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWinTwo(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithDescendingSlopeDiagonalWinTwo.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
 * │ r │   │   │   │   │   │   │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ r │ r │   │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ r │(r)│ b │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ b │ b │ r │   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWinThree(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithDescendingSlopeDiagonalWinThree.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
 * │ r │   │   │   │   │   │   │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ r │ b │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ r │ r │   │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ r │ b │ b │(r)│   │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWinFour(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithDescendingSlopeDiagonalWinFour.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
 * │   │(b)│   │   │   │   │   │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │ b │ b │ r │ r │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │ r │ r │ b │ b │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ b │ r │ r │ r │ b │   │   │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithDescendingSlopeDiagonalWinFive(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithDescendingSlopeDiagonalWinFive.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
 * │   │   │   │   │   │   │(r)│ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │ r │ r │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ b │ r │ r │ b │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ r │ b │ b │ b │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithAscendingSlopeDiagonalWinOne(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithAscendingSlopeDiagonalWinOne.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
 * │   │   │   │   │   │   │ r │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │(r)│ b │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ b │ r │ r │ r │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ r │ b │ b │ b │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithAscendingSlopeDiagonalWinTwo(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithAscendingSlopeDiagonalWinTwo.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
 * │   │   │   │   │   │   │ r │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │   │ r │ r │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ b │(r)│ r │ b │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │ r │ b │ b │ b │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithAscendingSlopeDiagonalWinThree(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithAscendingSlopeDiagonalWinThree.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
 * │   │   │   │   │   │   │ r │ 2
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ b │ r │ b │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │   │ r │ r │ b │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │   │   │   │(r)│ b │ b │ r │ 5
 * └───┴───┴───┴───┴───┴───┴───┘
 * ```
 */
export function populateBoardWithAscendingSlopeDiagonalWinFour(
  logicSessionRef: LogicSession,
): void {
  const genFunc = populateBoardWithAscendingSlopeDiagonalWinFour.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
  const genFunc = populateBoardWithVerticalWin.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
  const genFunc = populateBoardWithHorizontalWinOne.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
  const genFunc = populateBoardWithHorizontalWinTwo.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
  const genFunc = populateBoardWithHorizontalWinThree.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
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
  const genFunc = populateBoardWithHorizontalWinFour.name;

  populateBoardWithMoves({
    logicSessionRef,
    moves: moveTuplesByGenerator[genFunc],
  });
}

export const winningConditionGeneratorFuncs = [
  populateBoardWithDescendingSlopeDiagonalWinOne,
  populateBoardWithDescendingSlopeDiagonalWinTwo,
  populateBoardWithDescendingSlopeDiagonalWinThree,
  populateBoardWithDescendingSlopeDiagonalWinFour,
  populateBoardWithDescendingSlopeDiagonalWinFive,
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

/** @description Tuple of `[columnIndex, PlayerID]` */
export type MoveTuple = [number, PlayerID];

export function populateBoardWithMoves({
  logicSessionRef,
  moves,
}: {
  logicSessionRef: LogicSession;
  moves: MoveTuple[];
}) {
  moves.forEach(([columnIndex, playerID]) => {
    logicSessionRef.board.updateBoardState({
      columnIndex,
      playerID,
    });
  });

  return logicSessionRef;
}

type MoveTuplesByGenerator = {
  [generatorName: string]: MoveTuple[];
};

export const moveTuplesByGenerator: MoveTuplesByGenerator = {
  [populateBoardWithOneMoveTilWin.name]: [
    [3, mockPlayerOneID],
    [2, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [1, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [0, mockPlayerOneID],
    [3, mockPlayerTwoID],
  ],
  [populateBoardWithDescendingSlopeDiagonalWinOne.name]: [
    [3, mockPlayerOneID],
    [2, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [1, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [0, mockPlayerOneID],
    [3, mockPlayerTwoID],
    [0, mockPlayerOneID],
  ],
  [populateBoardWithDescendingSlopeDiagonalWinTwo.name]: [
    [3, mockPlayerOneID],
    [2, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [1, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [0, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [0, mockPlayerOneID],
    [3, mockPlayerTwoID],
    [1, mockPlayerOneID],
  ],
  [populateBoardWithDescendingSlopeDiagonalWinThree.name]: [
    [3, mockPlayerOneID],
    [1, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [0, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [0, mockPlayerOneID],
    [3, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [2, mockPlayerTwoID],
    [2, mockPlayerOneID],
  ],
  [populateBoardWithDescendingSlopeDiagonalWinFour.name]: [
    [0, mockPlayerOneID],
    [2, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [1, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [0, mockPlayerOneID],
    [2, mockPlayerTwoID],
    [3, mockPlayerOneID],
  ],
  [populateBoardWithDescendingSlopeDiagonalWinFive.name]: [
    [3, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [3, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [2, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [1, mockPlayerTwoID],
    [4, mockPlayerOneID],
    [1, mockPlayerTwoID],
  ],
  [populateBoardWithAscendingSlopeDiagonalWinOne.name]: [
    [3, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [4, mockPlayerOneID],
    [5, mockPlayerTwoID],
    [5, mockPlayerOneID],
    [6, mockPlayerTwoID],
    [5, mockPlayerOneID],
    [6, mockPlayerTwoID],
    [6, mockPlayerOneID],
    [3, mockPlayerTwoID],
    [6, mockPlayerOneID],
  ],
  [populateBoardWithAscendingSlopeDiagonalWinTwo.name]: [
    [3, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [4, mockPlayerOneID],
    [5, mockPlayerTwoID],
    [5, mockPlayerOneID],
    [6, mockPlayerTwoID],
    [6, mockPlayerOneID],
    [6, mockPlayerTwoID],
    [6, mockPlayerOneID],
    [3, mockPlayerTwoID],
    [5, mockPlayerOneID],
  ],
  [populateBoardWithAscendingSlopeDiagonalWinThree.name]: [
    [3, mockPlayerOneID],
    [5, mockPlayerTwoID],
    [5, mockPlayerOneID],
    [6, mockPlayerTwoID],
    [6, mockPlayerOneID],
    [6, mockPlayerTwoID],
    [6, mockPlayerOneID],
    [3, mockPlayerTwoID],
    [5, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [4, mockPlayerOneID],
  ],
  [populateBoardWithAscendingSlopeDiagonalWinFour.name]: [
    [6, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [4, mockPlayerOneID],
    [5, mockPlayerTwoID],
    [5, mockPlayerOneID],
    [6, mockPlayerTwoID],
    [5, mockPlayerOneID],
    [6, mockPlayerTwoID],
    [6, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [3, mockPlayerOneID],
  ],
  [populateBoardWithVerticalWin.name]: [
    [3, mockPlayerOneID],
    [1, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [2, mockPlayerTwoID],
    [3, mockPlayerOneID],
  ],
  [populateBoardWithHorizontalWinOne.name]: [
    [1, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [0, mockPlayerOneID],
  ],
  [populateBoardWithHorizontalWinTwo.name]: [
    [0, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [1, mockPlayerOneID],
  ],
  [populateBoardWithHorizontalWinThree.name]: [
    [0, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
  ],
  [populateBoardWithHorizontalWinFour.name]: [
    [0, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [3, mockPlayerOneID],
  ],
};
