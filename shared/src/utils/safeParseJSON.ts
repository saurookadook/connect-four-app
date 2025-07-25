import { log as sharedLog } from '../logger';

const logger = sharedLog.getLogger(safeParseJSON.name);

/**
 * @param maybeStringifiedObject
 * @returns If successful, returns parsed object. Otherwise, returns `null`.
 */
export function safeParseJSON<T = any>(
  maybeStringifiedObject: unknown,
): T | null {
  try {
    // @ts-expect-error: The whole purpose of this function is to gracefully handle unexpected inputs. :]
    return JSON.parse(maybeStringifiedObject);
  } catch (error) {
    logger.error(
      `Failed to parse '${maybeStringifiedObject}' (type ${typeof maybeStringifiedObject})`,
      error,
    );
    return null;
  }
}
