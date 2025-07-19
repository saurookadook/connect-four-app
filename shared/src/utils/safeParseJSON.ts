/**
 * @param maybeStringifiedObject
 * @returns If successful, returns parsed object. Otherwise, returns `null`.
 */
export function safeParseJson(
  maybeStringifiedObject: unknown,
): Record<string, any> | Array<any> | null {
  try {
    // @ts-expect-error: The whole purpose of this function is to gracefully handle unexpected inputs. :]
    return JSON.parse(maybeStringifiedObject);
  } catch (error) {
    console.error(
      `[safeParseJson] Failed to parse '${maybeStringifiedObject}' (type ${typeof maybeStringifiedObject})`,
      { cause: error },
    );
    return null;
  }
}
