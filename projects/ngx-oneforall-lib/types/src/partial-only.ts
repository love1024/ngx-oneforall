/**
 * Makes only the specified keys K optional while keeping the rest of T required.
 * The inverse of `RequiredOnly`.
 *
 * @template T - The object type.
 * @template K - The keys to make optional.
 *
 * @example
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * type UserWithOptionalEmail = PartialOnly<User, 'email'>;
 * // { id: number; name: string; email?: string; }
 */
export type PartialOnly<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
