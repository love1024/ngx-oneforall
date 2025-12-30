import { signal, Signal, inject, DestroyRef, NgZone } from '@angular/core';

/**
 * Controller interface for interval signal.
 */
export interface IntervalController {
  /** Current tick count */
  value: Signal<number>;
  /** Whether interval is running */
  running: Signal<boolean>;
  /** Start the interval */
  start: () => void;
  /** Stop the interval */
  stop: () => void;
}

/**
 * Creates a controllable interval signal that increments on each tick.
 * Runs outside Angular zone for performance and auto-cleans up on destroy.
 *
 * @param ms - Interval duration in milliseconds
 * @returns Controller object with value, running state, start, and stop
 *
 * @example
 * ```typescript
 * const timer = intervalSignal(1000);
 * timer.start();
 * console.log(timer.value()); // 0, 1, 2, ...
 * timer.stop();
 * ```
 */
export function intervalSignal(ms: number): IntervalController {
  const zone = inject(NgZone);
  const destroyRef = inject(DestroyRef);

  const value = signal(0);
  const running = signal(false);

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let count = 0;

  const start = () => {
    if (running()) return;
    running.set(true);

    zone.runOutsideAngular(() => {
      intervalId = setInterval(() => {
        zone.run(() => value.set(++count));
      }, ms);
    });
  };

  const stop = () => {
    running.set(false);
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  destroyRef.onDestroy(stop);

  return {
    value: value.asReadonly(),
    running: running.asReadonly(),
    start,
    stop,
  };
}
