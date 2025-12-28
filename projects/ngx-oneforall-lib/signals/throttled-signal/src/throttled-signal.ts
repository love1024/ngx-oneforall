import { Signal, signal, effect } from '@angular/core';

/**
 * Creates a throttled signal that limits how often the output updates.
 * Guarantees at most one update per delay period.
 *
 * @param source - The source signal to throttle
 * @param delay - Minimum time between updates in milliseconds
 * @returns A read-only signal with the throttled value
 *
 * @example
 * ```typescript
 * const scrollY = signal(0);
 * const throttledScroll = throttledSignal(scrollY, 100);
 * ```
 */
export function throttledSignal<T>(
  source: Signal<T>,
  delay: number
): Signal<T> {
  const out = signal(source());

  let lastEmit = Date.now();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  effect(onCleanup => {
    const value = source();
    const now = Date.now();
    const remaining = delay - (now - lastEmit);

    if (remaining <= 0) {
      lastEmit = now;
      out.set(value);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastEmit = Date.now();
        out.set(value);
      }, remaining);
    }

    onCleanup(() => clearTimeout(timeoutId));
  });

  return out;
}
