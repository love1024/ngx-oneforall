import { hashCode } from 'ngx-oneforall/utils/hash';

/**
 * Safely serializes any JavaScript value to a JSON string.
 * Handles non-JSON-serializable types and circular references.
 *
 * @param value - A single value to serialize.
 * @returns A JSON string representation.
 *
 * @example
 * // Basic usage
 * safeSerialize({ name: 'John', age: 30 });
 * // '{"age":30,"name":"John"}' (keys sorted)
 *
 * @example
 * // Non-JSON types
 * safeSerialize([() => {}, Symbol('id'), BigInt(123)]);
 * // '["__fn:anonymous|h:...","__sym:Symbol(id)","__bigint:123"]'
 *
 * @example
 * // Circular references
 * const obj = { self: null };
 * obj.self = obj;
 * safeSerialize(obj); // '{"self":"__circular__"}'
 *
 * @remarks
 * Serialization format:
 * - Functions: `__fn:name` or `__fn:anonymous|h:hash`
 * - Symbols: `__sym:Symbol(description)`
 * - BigInt: `__bigint:value`
 * - RegExp: `{ __type: 'RegExp', value: '/pattern/flags' }`
 * - Error: `{ __type: 'Error', name, message }`
 * - Map: `{ __type: 'Map', entries: [...] }`
 * - Set: `{ __type: 'Set', values: [...] }`
 * - WeakMap/WeakSet: `{ __type: 'WeakMap'|'WeakSet', note: 'Not iterable' }`
 * - Class instances: `{ __type: 'ClassName', ...props }`
 * - Circular refs: `__circular__`
 * - Object keys are sorted for deterministic output.
 */
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
    // Date is handled by JSON.stringify's built-in toJSON
    if (value instanceof RegExp) {
      return { __type: 'RegExp', value: value.toString() };
    }
    if (value instanceof Error) {
      return serializeError(value);
    }
    // WeakMap and WeakSet cannot be iterated, so we mark them as non-serializable
    if (value instanceof WeakMap) {
      return { __type: 'WeakMap', note: 'Not iterable' };
    }
    if (value instanceof WeakSet) {
      return { __type: 'WeakSet', note: 'Not iterable' };
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

/** Serializes a function to a string identifier with optional hash for anonymous functions. */
function serializeFunction(value: Function): string {
  const fn = value as { name?: string };
  const name = fn.name || 'anonymous';

  // Only hash when anonymous to distinguish between different anonymous functions
  if (!fn.name) {
    const source = value.toString();
    const length = value.length;
    const hash = hashCode(source + '|' + length);
    return `__fn:${name}|h:${hash}`;
  }

  // Named function → no hash needed
  return `__fn:${name}`;
}

/** Serializes a symbol to a string representation. */
function serializeSymbol(value: symbol): string {
  return `__sym:${String(value)}`;
}

/** Serializes a BigInt to a string representation. */
function serializeBigInt(value: bigint): string {
  return `__bigint:${value.toString()}`;
}

/** Serializes an Error to a type-tagged object. */
function serializeError(value: Error): object {
  return {
    __type: 'Error',
    name: value.name,
    message: value.message,
  };
}

/** Serializes a Map to a type-tagged object with its entries. */
function serializeMap(value: Map<unknown, unknown>): object {
  return {
    __type: 'Map',
    entries: Array.from(value.entries()),
  };
}

/** Serializes a Set to a type-tagged object with its values. */
function serializeSet(value: Set<unknown>): object {
  return {
    __type: 'Set',
    values: Array.from(value.values()),
  };
}

/**
 * Serializes an object, handling circular references and class instances.
 * Object keys are sorted for deterministic output.
 */
function serializeObject(value: object, seen: WeakSet<object>): unknown {
  // Detect circular references
  if (seen.has(value)) {
    return '__circular__';
  }
  seen.add(value);

  // Class instances (excluding built-in types) get a __type tag
  if (
    value.constructor &&
    value.constructor !== Object &&
    !Array.isArray(value) &&
    !(value instanceof Map) &&
    !(value instanceof Set) &&
    !(value instanceof WeakMap) &&
    !(value instanceof WeakSet) &&
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

  // Plain objects get sorted keys for deterministic output
  if (!Array.isArray(value)) {
    const sorted: Record<string, unknown> = {};
    const obj = value as Record<string, unknown>;
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = obj[key];
    }
    return sorted;
  }

  // Arrays are returned as-is
  return value;
}
