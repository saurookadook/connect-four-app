import { inspect } from 'node:util';

import { sharedLog } from '@connect-four-app/shared';

const logger = sharedLog.getLogger(instrument.name);
logger.setLevel('DEBUG');

const BasicAsyncFunction = (async () => {}).constructor;
// prettier-ignore
const BasicGeneratorFunction = (function* () {}).constructor;

const isAsync = (fn: any) =>
  fn != null &&
  (fn instanceof BasicAsyncFunction ||
    fn instanceof BasicGeneratorFunction ||
    typeof fn.then === 'function');

/**
 * @note This is supposed to log messages when each method is called but it doesn't
 * seem to work with `Injectable` classes
 */
export function instrument<T extends { new (...args: any[]): object }>(
  target: T,
) {
  const originalConstructor = target.prototype.constructor;

  logger.debug(`[  ${target.name} ] ${'='.repeat(120)}`);

  for (const key of Object.getOwnPropertyNames(originalConstructor.prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(
      originalConstructor.prototype,
      key,
    );

    logger.debug(
      `for key: '${key}' ${'-'.repeat(100)}\n`,
      inspect(
        {
          key,
          descriptor,
          isAsync: isAsync(descriptor?.value),
          typeofDescriptorValue: typeof descriptor?.value,
          typeofDescriptorValueThen:
            descriptor?.value?.then instanceof BasicAsyncFunction,
        },
        { colors: true, compact: false, depth: null },
      ),
    );

    if (descriptor == null) {
      return;
    }

    if (isAsync(descriptor.value)) {
      const originalAsyncFunction = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        console.log(
          `Calling async method '${key}' with arguments: ${args.join(', ')}`,
        );
        const result = await originalAsyncFunction.apply(this, args);

        if (result != null) {
          logger.debug(`Method '${key}' returned: ${result}`);
        }

        return result;
      };
    } else if (typeof descriptor.value === 'function') {
      const originalFunction = descriptor.value;

      descriptor.value = function (...args: any[]) {
        logger.debug(
          `Calling method '${key}' with arguments: ${args.join(', ')}`,
        );
        const result = originalFunction.apply(this, args);

        if (result != null) {
          logger.debug(`Method '${key}' returned: ${result}`);
        }

        return result;
      };
    }

    Object.defineProperty(originalConstructor, key, descriptor);
  }
}
