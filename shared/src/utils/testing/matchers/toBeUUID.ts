/* eslint-disable @typescript-eslint/no-namespace,@typescript-eslint/restrict-template-expressions */
import type { MatcherFunction } from 'expect';

export const toBeUUID: MatcherFunction = function (received: unknown) {
  if (typeof received !== 'string') {
    throw new TypeError(
      `Expected a string but received ${typeof received} ('${received}')`,
    );
  }

  const pass =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      received,
    );
  if (pass) {
    return {
      message: () =>
        `expected ${this.utils.printReceived(received)} (type: ${typeof received}) not to be a valid UUID`,
      pass: true,
    };
  } else {
    return {
      message: () =>
        `expected ${this.utils.printReceived(received)} (type: ${typeof received}) to be a valid UUID`,
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
