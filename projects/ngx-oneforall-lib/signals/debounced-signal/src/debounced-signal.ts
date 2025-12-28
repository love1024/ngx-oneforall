import { Signal, signal, effect } from '@angular/core';

/**
 * Creates a debounced signal that delays updating until the source
 * signal has stopped changing for the specified delay.
 *
 * @param source - The source signal to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns A read-only signal with the debounced value
 *
 * @example
 * ```typescript
 * const search = signal('');
 * const debouncedSearch = debouncedSignal(search, 300);
 * ```
 */
export function debouncedSignal<T>(
  source: Signal<T>,
  delay: number
): Signal<T> {
  const out = signal(source());

  let timeoutId: ReturnType<typeof setTimeout>;

  effect(onCleanup => {
    const value = source();

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => out.set(value), delay);

    onCleanup(() => clearTimeout(timeoutId));
  });

  return out;
}
