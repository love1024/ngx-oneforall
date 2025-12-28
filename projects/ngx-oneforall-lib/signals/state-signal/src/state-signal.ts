import {
  isDevMode,
  isSignal,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { StateSignal } from './state-signal.model';
import { isRecord } from '@ngx-oneforall/utils/is-record';

const STATE_SIGNAL = Symbol(isDevMode() ? 'STATE_SIGNAL' : '');

/**
 * Creates a "State Signal" that allows nested property access as signals and
 * propagates nested updates (.set()/.update()) back to the root signal.
 */
export function stateSignal<T extends object>(
  initialValue: T | WritableSignal<T>,
  onUpdate?: (value: T) => void
): StateSignal<T> {
  const source = isSignal(initialValue)
    ? initialValue
    : signal(initialValue as T);

  const wrapped = Object.assign(() => source(), source, {
    set: (value: T) => {
      source.set(value);
      onUpdate?.(value);
    },
    update: (updater: (value: T) => T) => {
      source.update(updater);
      onUpdate?.(untracked(source));
    },
  });

  return new Proxy(wrapped, {
    has(target: any, prop: string | symbol) {
      return !!this.get!(target, prop, undefined);
    },
    get(target: any, prop: string | symbol) {
      // Return the wrapped set/update methods for this signal level
      if (prop === 'set' || prop === 'update' || prop === 'asReadonly')
        return target[prop];

      const value = untracked(target);

      // If value is not a record we can recurse into, or prop doesn't exist, handle cleanup and return
      if (!isRecord(value) || !(prop in value)) {
        if (isSignal(target[prop]) && (target[prop] as any)[STATE_SIGNAL]) {
          delete target[prop];
        }
        return target[prop];
      }

      if (!isSignal(target[prop])) {
        const nested = stateSignal((value as any)[prop], childVal => {
          // BUBBLING: When child updates, we update parent
          target.update((parent: any) => ({ ...parent, [prop]: childVal }));
        });

        Object.defineProperty(target, prop, {
          value: nested,
          configurable: true,
        });
        target[prop][STATE_SIGNAL] = true;
      }

      return target[prop];
    },
  }) as any;
}
