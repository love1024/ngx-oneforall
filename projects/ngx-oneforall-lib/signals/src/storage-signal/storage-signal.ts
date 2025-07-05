import {
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
  const providedInjector = assertAndGetInjector<T>(options);
  const destroyRef = providedInjector(DestroyRef);

  const {
    storage = localStorage,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    crossTabSync = false,
  } = options;

  let initialValue = defaultValue;
  try {
    const data = storage.getItem(key);
    if (data !== null) {
      initialValue = deserializer(data);
    }
  } catch {
    // ignore initial get item error
  }

  const state = signal<T>(initialValue);
  effect(() => {
    try {
      storage.setItem(key, serializer(state()));
    } catch (err) {
      console.log(`[storageSignal] failed to store ${key}`, err);
    }
  });

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

  return state;
}

function assertAndGetInjector<T>(options: StorageSignalOptions<T>) {
  let providedInjector;
  try {
    assertInInjectionContext(storageSignal);
    providedInjector = inject;
  } catch (err) {
    if (options.injector) {
      providedInjector = inject;
    } else {
      throw err;
    }
  }

  return providedInjector;
}
