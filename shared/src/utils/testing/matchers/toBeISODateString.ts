/* eslint-disable @typescript-eslint/no-namespace,@typescript-eslint/restrict-template-expressions */
import type { MatcherFunction } from 'expect';

export const toBeISODateString: MatcherFunction = function (received: unknown) {
  if (typeof received !== 'string') {
    throw new TypeError(
      `Expected a string but received ${typeof received} ('${received}')`,
    );
  }

  const pass = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(
    received,
  );
  if (pass) {
    return {
      message: () =>
        `expected ${this.utils.printReceived(received)} not to be an ISO date string`,
      pass: true,
    };
  } else {
    return {
      message: () =>
        `expected ${this.utils.printReceived(received)} to be an ISO date string`,
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
      toBeISODateString: () => void;
    }

    interface AsymmetricMatchers {
      toBeISODateString: () => void;
    }

    interface Matchers<R> {
      toBeISODateString(): R;
    }
  }
}
