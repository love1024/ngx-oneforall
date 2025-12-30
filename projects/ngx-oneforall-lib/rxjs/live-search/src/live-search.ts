import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

/**
 * A function that takes a query string and returns an Observable of search results.
 */
export type DataProducer<T> = (query: string) => Observable<T>;

/**
 * RxJS operator for live search functionality.
 * It debounces input, filters duplicates, and switches to the latest observable.
 *
 * @param delay - The debounce delay in milliseconds.
 * @param dataProducer - A function that returns an Observable of results for a given query.
 * @returns An OperatorFunction that transforms a string stream into a result stream.
 *
 * @example
 * source$.pipe(
 *   liveSearch(300, (query) => http.get(\`/api/search?q=\${query}\`))
 * )
 */
export function liveSearch<T>(
  delay: number,
  dataProducer: DataProducer<T>
): OperatorFunction<string, T> {
  return (source: Observable<string>) => {
    return source.pipe(
      debounceTime(delay),
      distinctUntilChanged(),
      switchMap(dataProducer)
    );
  };
}
