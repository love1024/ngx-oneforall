import { isObservable, lastValueFrom, Observable } from 'rxjs';

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
