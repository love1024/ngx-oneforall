import { Observable, retry, timer } from 'rxjs';

/**
 * Configuration for the backoff retry operator.
 */
export interface BackoffRetryConfig {
  /** Maximum number of retry attempts. Default: 3 */
  count: number;
  /** Initial delay in milliseconds. Default: 1000 */
  delay: number;
  /** Exponential base. Default: 2 */
  base: number;
}

const DEFAULT_CONFIG: BackoffRetryConfig = { count: 3, delay: 1000, base: 2 };

/**
 * RxJS operator that retries a source observable with exponential backoff.
 *
 * @param config - Configuration object
 * @returns Observable operator
 */
export function backOffRetry<T>(config: Partial<BackoffRetryConfig> = {}) {
  const { count, delay, base } = { ...DEFAULT_CONFIG, ...config };
  return (source$: Observable<T>) =>
    source$.pipe(
      retry({
        count,
        delay: (_, retryCount) => {
          // retryCount starts at 1
          // 1st retry: base^(1-1) * delay = 1 * delay
          const currentDelay = Math.pow(base, retryCount - 1) * delay;
          return timer(currentDelay);
        },
      })
    );
}
