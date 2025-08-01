export const UUID_REGEX_PATTERN =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

export function isUUID(value: unknown): boolean {
  return (
    typeof value === 'string' && // force formatting
    value !== '' &&
    UUID_REGEX_PATTERN.test(value)
  );
}
