/**
 * Represents any callable function type.
 * Useful for generic function parameters or method signatures.
 *
 * @template Args - Tuple type of function arguments. Default is `any[]`.
 * @template Return - Return type of the function. Default is `any`.
 *
 * @example
 * type StringMapper = Callable<[string], string>;
 * const fn: StringMapper = (s) => s.toUpperCase();
 *
 * @example
 * function wrap<T extends Callable>(fn: T): T {
 *   return fn;
 * }
 */
export type Callable<Args extends any[] = any[], Return = any> = {
  (...args: Args): Return;
};
