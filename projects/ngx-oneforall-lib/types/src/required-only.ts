/**
 * Makes only the specified keys K required while keeping the rest of T as-is.
 * The inverse of `PartialOnly`.
 *
 * @template T - The object type.
 * @template K - The keys to make required.
 *
 * @example
 * interface User {
 *   id: number;
 *   name?: string;
 *   email?: string;
 * }
 *
 * type UserWithRequiredName = RequiredOnly<User, 'name'>;
 * // { id: number; name: string; email?: string; }
 */
export type RequiredOnly<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
