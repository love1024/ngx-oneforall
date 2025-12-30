/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { WritableSignal } from '@angular/core';

export type Builtin =
  | Date
  | Error
  | RegExp
  | ArrayBuffer
  | DataView
  | Function
  | Iterable<any>
  | WeakSet<any>
  | WeakMap<any, any>
  | Promise<any>;

/**
 * Checks if a type is a plain object/array that we can safely recurse into.
 */
export type IsRecord<T> = T extends object
  ? T extends Builtin
    ? false
    : true
  : false;

/**
 * The "Gatekeeper": Returns true if the type has dynamic keys or is too vague.
 */
export type IsUnsafeToRecurse<T> = keyof T extends never
  ? true // Empty objects {} or 'never'
  : string extends keyof T
    ? true // Record<string, any>
    : symbol extends keyof T
      ? true // Objects with dynamic symbols
      : number extends keyof T
        ? true // Arrays or Record<number, any>
        : false;

export type StateSignal<T> = WritableSignal<T> &
  (IsRecord<T> extends true
    ? {
        readonly [K in keyof T]: IsRecord<T[K]> extends true
          ? IsUnsafeToRecurse<T[K]> extends true
            ? WritableSignal<T[K]>
            : StateSignal<T[K]>
          : WritableSignal<T[K]>;
      }
    : unknown);
