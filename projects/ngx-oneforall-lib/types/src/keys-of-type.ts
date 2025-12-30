/**
 * Extracts keys from T whose values are assignable to U.
 *
 * @template T - The object type to extract keys from.
 * @template U - The value type to filter by.
 *
 * @example
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 *   email: string;
 * }
 *
 * type StringKeys = KeysOfType<User, string>; // 'name' | 'email'
 * type NumberKeys = KeysOfType<User, number>; // 'id' | 'age'
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
