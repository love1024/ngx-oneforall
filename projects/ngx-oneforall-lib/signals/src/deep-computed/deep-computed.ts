import { computed, isDevMode, isSignal, untracked } from '@angular/core';
import { DeepComputed } from './deep-computed.model';
import { isRecord } from '@ngx-oneforall/utils';

// Reference - https://github.com/ngrx/platform/blob/main/modules/signals/src/deep-signal.ts

const DEEP_COMPUTED = Symbol(isDevMode() ? 'DEEP_COMPUTED' : '');

export function deepComputed<T extends object>(
  factory: () => T
): DeepComputed<T> {
  const computation = computed(factory);

  return new Proxy(computation, {
    has(target: any, prop: string | symbol) {
      return !!this.get!(target, prop, undefined);
    },
    get(target: any, prop: string) {
      const value = untracked(target);
      if (!isRecord(value) || !(prop in value)) {
        if (isSignal(target[prop]) && (target[prop] as any)[DEEP_COMPUTED]) {
          delete target[prop];
        }

        return target[prop];
      }

      if (!isSignal(target[prop])) {
        Object.defineProperty(target, prop, {
          value: computed(() => target()[prop]),
          configurable: true,
        });
        target[prop][DEEP_COMPUTED] = true;
      }

      return deepComputed(target[prop]);
    },
  });
}
