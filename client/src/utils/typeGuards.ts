export function isUUID(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value !== '' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}
