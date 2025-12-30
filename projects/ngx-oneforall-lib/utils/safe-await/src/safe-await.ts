import { isObservable, lastValueFrom, Observable } from 'rxjs';

/**
 * Go-style error handling for async operations.
 * Wraps a Promise or Observable and returns a tuple `[result, error]` instead of throwing.
 *
 * @param input - A Promise or Observable to await safely.
 * @returns A tuple where:
 *   - On success: `[result, null]`
 *   - On failure: `[null, error]`
 *
 * @example
 * // With Promise
 * const [user, error] = await safeAwait(fetchUser(id));
 * if (error) {
 *   console.error('Failed to fetch user:', error);
 *   return;
 * }
 * console.log(user.name);
 *
 * @example
 * // With Observable
 * const [data, error] = await safeAwait(this.http.get('/api/data'));
 * if (error) {
 *   return handleError(error);
 * }
 * return data;
 *
 * @remarks
 * - Observables are converted using `lastValueFrom`, which waits for the last emitted value.
 * - Empty Observables (complete without emitting) will result in an `EmptyError`.
 * - This pattern eliminates try/catch blocks and makes error handling explicit.
 */
export const safeAwait = async <T>(
  input: Promise<T> | Observable<T>
): Promise<[T, never] | [never, Error]> => {
  const promise = isObservable(input) ? lastValueFrom(input) : input;
  try {
    const result = await promise;
    return [result, null as never];
  } catch (error) {
    return [null as never, error as Error];
  }
};
