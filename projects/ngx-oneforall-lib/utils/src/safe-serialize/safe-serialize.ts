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
    // We don't need handling for Date because strinfigy calls toJSON internally
    if (value instanceof RegExp) {
      return { __type: 'RegExp', value: value.toString() };
    }
    if (value instanceof Error) {
      return {
        __type: 'Error',
        name: value.name,
        message: value.message,
      };
    }
    if (value instanceof Map) {
      return {
        __type: 'Map',
        entries: Array.from(value.entries()),
      };
    }
    if (value instanceof Set) {
      return {
        __type: 'Set',
        values: Array.from(value.values()),
      };
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '__circular__';
      }
      seen.add(value);
      if (
        value.constructor &&
        value.constructor !== Object &&
        !Array.isArray(value) &&
        !(value instanceof Map) &&
        !(value instanceof Set) &&
        !(value instanceof Date) &&
        !(value instanceof RegExp) &&
        !(value instanceof Error)
      ) {
        const sorted: Record<string, unknown> = {};
        const obj = value as Record<string, unknown>;
        for (const key of Object.keys(obj).sort()) {
          sorted[key] = obj[key];
        }
        return { __type: value.constructor.name, ...sorted };
      }
      if (!Array.isArray(value)) {
        const sorted: Record<string, unknown> = {};
        const obj = value as Record<string, unknown>;
        for (const key of Object.keys(obj).sort()) {
          sorted[key] = obj[key];
        }
        return sorted;
      }
    }

    return value;
  });
}
