import {
  afterNextRender,
  assertInInjectionContext,
  DestroyRef,
  effect,
  inject,
  Injector,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

export interface StorageSignalOptions<T> {
  storage?: Storage;
  serializer?: (v: T) => string;
  deserializer?: (data: string) => T;
  crossTabSync?: boolean;
  syncInterval?: number;
  injector?: Injector;
}

export function storageSignal<T>(
  key: string,
  defaultValue: T,
  options: StorageSignalOptions<T> = {}
): WritableSignal<T> {
  const injector = assertAndGetInjector<T>(options);
  const state = signal<T>(defaultValue);

  afterNextRender(
    () => {
      init<T>(state, key, defaultValue, options, injector);
    },
    { injector }
  );

  return state;
}

function init<T>(
  state: WritableSignal<T>,
  key: string,
  defaultValue: T,
  options: StorageSignalOptions<T>,
  injector: Injector
) {
  const {
    storage = localStorage,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    crossTabSync = false,
  } = options;
  const destroyRef = injector.get(DestroyRef);

  let initialValue = defaultValue;
  try {
    const data = storage.getItem(key);
    if (data !== null) {
      initialValue = deserializer(data);
    }
  } catch {
    // ignore initial get item error
  }

  state.set(initialValue);

  effect(
    () => {
      try {
        storage.setItem(key, serializer(state()));
      } catch (err) {
        console.log(`[storageSignal] failed to store ${key}`, err);
      }
    },
    { injector }
  );

  if (crossTabSync && typeof window !== 'undefined') {
    fromEvent(window, 'storage')
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((e: Event) => {
        const event = e as StorageEvent;
        if (
          event.key !== key ||
          event.storageArea !== storage ||
          event.newValue === null
        )
          return;
        try {
          state.set(deserializer(event.newValue));
        } catch {
          // ignore errors here
        }
      });
  }
}

function assertAndGetInjector<T>(options: StorageSignalOptions<T>): Injector {
  let providedInjector: Injector;
  try {
    assertInInjectionContext(storageSignal);
    providedInjector = inject(Injector);
  } catch (err) {
    if (options.injector) {
      providedInjector = options.injector;
    } else {
      throw (
        err +
        '. Other than above options, You can also pass the injector in the options.'
      );
    }
  }

  return providedInjector;
}
