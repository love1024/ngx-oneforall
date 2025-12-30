/**
 * Set of built-in constructors that should not be considered records.
 * These are excluded even though they are objects.
 */
const NON_RECORD_CONSTRUCTORS = new Set<unknown>([
  Object,
  Date,
  RegExp,
  Error,
  Promise,
  Map,
  Set,
  WeakMap,
  WeakSet,
  ArrayBuffer,
  SharedArrayBuffer,
  DataView,
  Blob,
  File,
  URL,
]);

/**
 * Type guard that checks if a value is a plain object (record).
 * A record is an object literal `{}` or an object with `null`/`Object.prototype` as its prototype.
 *
 * @param value - The value to check.
 * @returns `true` if value is a plain object, `false` for arrays, class instances, built-ins, etc.
 *
 * @example
 * isRecord({});              // true
 * isRecord({ a: 1, b: 2 });  // true
 * isRecord([1, 2, 3]);       // false (array)
 * isRecord(new Date());      // false (built-in)
 * isRecord(new Map());       // false (built-in)
 * isRecord(null);            // false
 *
 * @remarks
 * Detection strategy:
 * 1. Fast path: Check if prototype is `null` or `Object.prototype`
 * 2. Exclude known built-in constructors from `NON_RECORD_CONSTRUCTORS`
 * 3. Fallback to `isPlainObject` for edge cases
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  // Most objects in state are plain literals.
  const proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype) {
    return true;
  }

  // Check for non records
  if (NON_RECORD_CONSTRUCTORS.has(value.constructor)) {
    return false;
  }

  // Handle edge cases (e.g., classes that extend Built-ins)
  // We only reach this for custom classes or unusual objects.
  return isPlainObject(value);
}

/**
 * Checks if a value is a plain object using `Object.prototype.toString`.
 * Used as a fallback for edge cases not caught by the fast path.
 *
 * @param value - The value to check.
 * @returns `true` if value is a plain object.
 */
function isPlainObject(value: any): boolean {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }
  const prop = Object.getPrototypeOf(value);
  return prop === null || prop === Object.prototype;
}
