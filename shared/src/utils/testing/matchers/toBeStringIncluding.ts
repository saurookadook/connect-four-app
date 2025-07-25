/* eslint-disable @typescript-eslint/no-namespace,@typescript-eslint/restrict-template-expressions */
import type { MatcherFunction } from 'expect';

export const toBeStringIncluding: MatcherFunction<[subString: string]> =
  function (received: unknown, subString: string) {
    if (typeof received !== 'string') {
      throw new TypeError(
        `Expected a string but received ${typeof received} ('${received}')`,
      );
    }

    const pass = String(received).includes(subString);

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(received)} not to include ${this.utils.printExpected(subString)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(received)} to include ${this.utils.printExpected(subString)}`,
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
      toBeStringIncluding: (subString: string) => void;
    }

    interface AsymmetricMatchers {
      toBeStringIncluding: (subString: string) => void;
    }

    interface Matchers<R> {
      toBeStringIncluding(subString: string): R;
    }
  }
}
