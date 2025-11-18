import { hashCode } from '../hash/hash';

export function safeSerialize(value: unknown): string;
export function safeSerialize(...args: unknown[]): string;
export function safeSerialize(...args: unknown[]): string {
  const seen = new WeakSet();
  const input = args.length === 1 ? args[0] : args;

  return JSON.stringify(input, (_key, value) => {
    if (typeof value === 'function') {
      return serializeFunction(value);
    }
    if (typeof value === 'symbol') {
      return serializeSymbol(value);
    }
    if (typeof value === 'bigint') {
      return serializeBigInt(value);
    }
    // We don't need handling for Date because strinfigy calls toJSON internally
    if (value instanceof RegExp) {
      return { __type: 'RegExp', value: value.toString() };
    }
    if (value instanceof Error) {
      return serializeError(value);
    }
    if (value instanceof Map) {
      return serializeMap(value);
    }
    if (value instanceof Set) {
      return serializeSet(value);
    }
    if (typeof value === 'object' && value !== null) {
      return serializeObject(value, seen);
    }

    return value;
  });
}

function serializeFunction(value: Function): string {
  const fn = value as { name?: string };
  const name = fn.name || 'anonymous';

  // Only hash when anonymous
  if (!fn.name) {
    const source = value.toString();
    const length = value.length;
    const hash = hashCode(source + '|' + length);
    return `__fn:${name}|h:${hash}`;
  }

  // Named function → no hash
  return `__fn:${name}`;
}

function serializeSymbol(value: symbol): string {
  return `__sym:${String(value)}`;
}

function serializeBigInt(value: bigint): string {
  return `__bigint:${value.toString()}`;
}

function serializeError(value: Error): object {
  return {
    __type: 'Error',
    name: value.name,
    message: value.message,
  };
}

function serializeMap(value: Map<unknown, unknown>): object {
  return {
    __type: 'Map',
    entries: Array.from(value.entries()),
  };
}

function serializeSet(value: Set<unknown>): object {
  return {
    __type: 'Set',
    values: Array.from(value.values()),
  };
}

function serializeObject(value: object, seen: WeakSet<object>): unknown {
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

  return value;
}
