import { Observable, OperatorFunction, retry, timer } from 'rxjs';

/**
 * Configuration for the backoff retry operator.
 */
export interface BackoffRetryConfig {
  /** Maximum number of retry attempts. Default: 3 */
  count: number;
  /** Initial delay in milliseconds. Default: 1000 */
  delay: number;
  /** Exponential base for backoff calculation. Default: 2 */
  base: number;
  /** Maximum delay cap in milliseconds. Optional - if not set, delay grows unbounded by retry count. */
  maxDelay?: number;
}

const DEFAULT_CONFIG: Omit<BackoffRetryConfig, 'maxDelay'> = {
  count: 3,
  delay: 1000,
  base: 2,
};

/**
 * RxJS operator that retries a source observable with exponential backoff.
 * Delay formula: `min(base^(retryCount-1) * delay, maxDelay)`
 *
 * @param config - Configuration for retry behavior.
 * @returns An OperatorFunction that retries with exponential backoff on errors.
 *
 * @example
 * // Basic usage - retries at 1000ms, 2000ms, 4000ms
 * source$.pipe(backOffRetry({ count: 3, delay: 1000, base: 2 }))
 *
 * @example
 * // With maxDelay cap - retries at 500ms, 1000ms, 2000ms, 2000ms, 2000ms
 * source$.pipe(backOffRetry({ count: 5, delay: 500, base: 2, maxDelay: 2000 }))
 */
export function backOffRetry<T>(
  config: Partial<BackoffRetryConfig> = {}
): OperatorFunction<T, T> {
  const { count, delay, base, maxDelay } = { ...DEFAULT_CONFIG, ...config };

  return (source$: Observable<T>) =>
    source$.pipe(
      retry({
        count,
        delay: (_, retryCount) => {
          // retryCount starts at 1
          // 1st retry: base^(1-1) * delay = 1 * delay
          const calculatedDelay = Math.pow(base, retryCount - 1) * delay;
          const currentDelay = maxDelay
            ? Math.min(calculatedDelay, maxDelay)
            : calculatedDelay;
          return timer(currentDelay);
        },
      })
    );
}
