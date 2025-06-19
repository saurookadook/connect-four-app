/* eslint-disable @typescript-eslint/no-namespace,@typescript-eslint/restrict-template-expressions */
import type { MatcherFunction } from 'expect';

export const toBeUUID: MatcherFunction = function (actual: unknown) {
  if (typeof actual !== 'string') {
    throw new TypeError(
      `Expected a string but received ${typeof actual} ('${actual}')`,
    );
  }

  const pass =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      actual,
    );
  if (pass) {
    return {
      message: () =>
        `expected ${this.utils.printReceived(actual)} not to be a valid UUID`,
      pass: true,
    };
  } else {
    return {
      message: () =>
        `expected ${this.utils.printReceived(actual)} to be a valid UUID`,
      pass: false,
    };
  }
};

/**
 * @see {@link https://kettanaito.com/blog/practical-guide-to-custom-jest-matchers | Practical Guide to Custom Jest Matchers}
 */
declare global {
  namespace jest {
    interface Expect {
      toBeUUID: () => void;
    }

    interface AsymmetricMatchers {
      toBeUUID: () => void;
    }

    interface Matchers<R> {
      toBeUUID(): R;
    }
  }
}
