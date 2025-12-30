import { KeysOfType } from './keys-of-type';

/**
 * Picks properties from T whose values are assignable to V.
 * The inverse of `OmitByValue`.
 *
 * @template T - The object type to pick properties from.
 * @template V - The value type to filter by.
 *
 * @example
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 *
 * type OnlyStrings = PickByValue<User, string>;
 * // { name: string; }
 */
export type PickByValue<T, V> = Pick<T, KeysOfType<T, V>>;
