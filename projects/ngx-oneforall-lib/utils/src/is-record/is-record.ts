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
]);

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

function isPlainObject(value: any): boolean {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }
  const prop = Object.getPrototypeOf(value);
  return prop === null || prop === Object.prototype;
}
