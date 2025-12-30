import { KeysOfType } from './keys-of-type';

/**
 * Omits properties from T whose values are assignable to V.
 * The inverse of `PickByValue`.
 *
 * @template T - The object type to omit properties from.
 * @template V - The value type to filter out.
 *
 * @example
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 *
 * type WithoutStrings = OmitByValue<User, string>;
 * // { id: number; age: number; }
 */
export type OmitByValue<T, V> = Omit<T, KeysOfType<T, V>>;
