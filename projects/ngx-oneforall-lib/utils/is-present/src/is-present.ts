/**
 * Type guard that checks if a value is neither `null` nor `undefined`.
 * Narrows the type to `NonNullable<T>`, removing nullish types.
 *
 * @param value - The value to check.
 * @returns `true` if value is not `null` and not `undefined`.
 *
 * @example
 * // Type narrowing
 * const value: string | null | undefined = getValue();
 * if (isPresent(value)) {
 *   console.log(value.toUpperCase()); // TypeScript knows value is string
 * }
 *
 * @example
 * // Array filtering
 * const items = [1, null, 2, undefined, 3];
 * const filtered = items.filter(isPresent); // number[]
 *
 * @remarks
 * Uses loose equality (`!= null`) which catches both `null` and `undefined`
 * in a single check, making it more concise than `!== null && !== undefined`.
 */
export function isPresent<T>(value: T): value is NonNullable<T> {
  return value != null;
}
