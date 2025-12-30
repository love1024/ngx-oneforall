/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Conditional type that evaluates to `true` if T is an arrow function, `false` otherwise.
 * Arrow functions cannot have a `this` binding, which is how this type distinguishes them.
 *
 * @template T - The type to check.
 *
 * @example
 * type A = IsArrowFunction<() => void>;           // true
 * type B = IsArrowFunction<(x: number) => number>; // true
 * type C = IsArrowFunction<{ (): void }>;          // false (callable interface)
 *
 * @remarks
 * This uses the fact that arrow functions cannot have an explicit `this` parameter.
 */
export type IsArrowFunction<T> = T extends (this: any, ...args: any[]) => any
  ? false
  : T extends (...args: any[]) => any
    ? true
    : false;
