export function safeSerialize(value: unknown): string;
export function safeSerialize(...args: unknown[]): string;
export function safeSerialize(...args: unknown[]): string {
  const seen = new WeakSet();
  const input = args.length === 1 ? args[0] : args;

  return JSON.stringify(input, (_key, value) => {
    if (typeof value === 'function') {
      const fn = value as { name?: string };
      return `__fn:${fn.name || 'anonymous'}`;
    }

    if (typeof value === 'symbol') {
      return `__sym:${String(value)}`;
    }

    if (typeof value === 'bigint') {
      return `__bigint:${value.toString()}`;
    }

    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '__circular__';
      }
      seen.add(value);
    }

    return value;
  });
}
