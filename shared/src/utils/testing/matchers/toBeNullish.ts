/* eslint-disable @typescript-eslint/no-namespace */
import type { MatcherFunction } from 'expect';

/**
 * @description Tests whether a given value is 'nullish' (or 'loosely null'). It
 * accomplishes this by using the loose comparison operator: `received == null`.
 */
export const toBeNullish: MatcherFunction = function (received: unknown) {
  const pass = received == null;

  if (pass) {
    return {
      message: () =>
        `expected ${this.utils.printReceived(received)} not to be 'null' or 'undefined'`,
      pass: true,
    };
  } else {
    return {
      message: () =>
        `expected ${this.utils.printReceived(received)} to be 'null' or 'undefined'`,
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
      toBeNullish: () => void;
    }

    interface AsymmetricMatchers {
      toBeNullish: () => void;
    }

    interface Matchers<R> {
      toBeNullish(): R;
    }
  }
}
