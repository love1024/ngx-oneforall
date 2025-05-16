import { Observable, retry, timer } from 'rxjs';

const CONFIG = { count: 3, delay: 1000, base: 2 };

const mergeConfig = (config: typeof CONFIG) => ({
  ...CONFIG,
  ...config,
});

export function backOffRetry<T>(config = CONFIG) {
  const { count, delay, base } = mergeConfig(config);
  return (source$: Observable<T>) =>
    source$.pipe(
      retry({
        count,
        delay: (_, retryCount) => {
          const currentDelay = Math.pow(base, retryCount) * delay;
          return timer(currentDelay);
        },
      })
    );
}
