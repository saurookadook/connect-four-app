import { LogicSession } from '@/game-logic-engine';
import { mockPlayerOneID, mockPlayerTwoID } from '@/mocks';
import { type PlayerID } from '@/types/main';

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
  [populateBoardWithDescendingSlopeDiagonalWinTwo.name]: [],
  [populateBoardWithDescendingSlopeDiagonalWinThree.name]: [],
  [populateBoardWithDescendingSlopeDiagonalWinFour.name]: [],
  [populateBoardWithAscendingSlopeDiagonalWinOne.name]: [],
  [populateBoardWithAscendingSlopeDiagonalWinTwo.name]: [],
  [populateBoardWithAscendingSlopeDiagonalWinThree.name]: [],
  [populateBoardWithAscendingSlopeDiagonalWinFour.name]: [],
  [populateBoardWithVerticalWin.name]: [],
  [populateBoardWithHorizontalWinOne.name]: [],
  [populateBoardWithHorizontalWinTwo.name]: [],
  [populateBoardWithHorizontalWinThree.name]: [],
  [populateBoardWithHorizontalWinFour.name]: [],
};

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
 * │ R │ R │   │   │   │   │   │ 3
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ R │ R │ B │   │   │   │ 4
 * ├───┼───┼───┼───┼───┼───┼───┤
 * │ B │ B │ B │ R │   │   │   │ 5
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
    [3, mockPlayerOneID],
    [1, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [0, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [2, mockPlayerTwoID],
    [3, mockPlayerOneID],
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
    [1, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [0, mockPlayerOneID],
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
    [0, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [1, mockPlayerOneID],
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
    [0, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [3, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
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
    [0, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [1, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [2, mockPlayerOneID],
    [4, mockPlayerTwoID],
    [3, mockPlayerOneID],
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
