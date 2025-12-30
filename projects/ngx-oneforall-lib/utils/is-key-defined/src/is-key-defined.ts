/**
 * Type guard that checks if an object has a defined (non-undefined) value for a given key.
 * Narrows the type to include the key as non-nullable.
 *
 * @param obj - The object to check.
 * @param key - The key to check for.
 * @param ownPropertyOnly - If true (default), only checks own properties. If false, includes inherited properties.
 * @returns `true` if the key exists and its value is not `undefined`.
 *
 * @example
 * // Type narrowing
 * const user = { name: 'John', age: undefined };
 * if (isKeyDefined(user, 'name')) {
 *   console.log(user.name.toUpperCase()); // TypeScript knows name is string
 * }
 *
 * @example
 * // Checking inherited properties
 * class Base { inherited = 'value'; }
 * class Child extends Base {}
 * isKeyDefined(new Child(), 'inherited', false); // true
 *
 * @remarks
 * - Uses `Object.prototype.hasOwnProperty.call()` to avoid prototype pollution
 * - Returns `false` for `undefined` values, but `true` for `null` values
 */
export function isKeyDefined<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  ownPropertyOnly = true
): obj is T & Record<K, NonNullable<T[K]>> {
  if (ownPropertyOnly) {
    return (
      Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined
    );
  }
  return key in obj && obj[key] !== undefined;
}
