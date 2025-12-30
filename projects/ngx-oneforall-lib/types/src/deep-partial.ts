/**
 * Recursively makes all properties of T optional.
 * Unlike `Partial<T>`, this works on nested objects.
 *
 * @template T - The object type to make deeply partial.
 *
 * @example
 * interface User {
 *   name: string;
 *   address: {
 *     city: string;
 *     zip: number;
 *   };
 * }
 *
 * type PartialUser = DeepPartial<User>;
 * // { name?: string; address?: { city?: string; zip?: number; }; }
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
    }
  : T;
