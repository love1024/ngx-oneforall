import { of, throwError } from 'rxjs';
import { safeAwait } from './safe-await';

describe('safeAwait', () => {
  it('should resolve a successful promise', async () => {
    const promise = Promise.resolve('success');
    const [result, error] = await safeAwait(promise);
    expect(result).toBe('success');
    expect(error).toBeNull();
  });

  it('should catch a rejected promise', async () => {
    const promise = Promise.reject(new Error('fail'));
    const [result, error] = await safeAwait(promise);
    expect(result).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('fail');
  });

  it('should resolve a successful observable', async () => {
    const obs$ = of('observable success');
    const [result, error] = await safeAwait(obs$);
    expect(result).toBe('observable success');
    expect(error).toBeNull();
  });

  it('should catch an error from an observable', async () => {
    const obs$ = throwError(() => new Error('observable fail'));
    const [result, error] = await safeAwait(obs$);
    expect(result).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe('observable fail');
  });
});
