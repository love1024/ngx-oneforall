import { isObservable, of, throwError } from 'rxjs';
import { CatchError } from './catch-error';

describe('CatchError Decorator', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  class TestClass {
    @CatchError('fallback', true)
    syncMethod(shouldThrow = true) {
      if (shouldThrow) throw new Error('Sync Error');
      return 'success';
    }

    @CatchError((err: Error) => `dynamic-${err.message}`)
    syncDynamicMethod() {
      throw new Error('Sync Error');
    }

    @CatchError('fallback', true)
    async asyncMethod(shouldThrow = true) {
      if (shouldThrow) throw new Error('Async Error');
      return 'success';
    }

    @CatchError((err: Error) => `dynamic-${err.message}`)
    async asyncDynamicMethod() {
      throw new Error('Async Error');
    }

    @CatchError('fallback', true)
    observableMethod(shouldThrow = true) {
      if (shouldThrow) return throwError(() => new Error('Observable Error'));
      return of('success');
    }

    @CatchError((err: Error) => of(`dynamic-${err.message}`))
    observableDynamicMethod() {
      return throwError(() => new Error('Observable Error'));
    }

    @CatchError('fallback', false)
    observableNoLogMethod() {
      return throwError(() => new Error('Observable Error'));
    }

    @CatchError(undefined, true)
    observableNoFallbackMethod() {
      return throwError(() => new Error('Original Error'));
    }

    @CatchError('fallback', false)
    async asyncNoLogMethod() {
      throw new Error('Async Error');
    }

    @CatchError('fallback', false)
    noLogMethod() {
      throw new Error('No Log Error');
    }
  }

  const instance = new TestClass();

  describe('Synchronous Methods', () => {
    it('should catch error and return static fallback', () => {
      const result = instance.syncMethod();
      expect(result).toBe('fallback');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should catch error and return dynamic fallback', () => {
      const result = instance.syncDynamicMethod();
      expect(result).toBe('dynamic-Sync Error');
    });

    it('should return result if no error', () => {
      const result = instance.syncMethod(false);
      expect(result).toBe('success');
    });
  });

  describe('Asynchronous Methods', () => {
    it('should catch error and return static fallback', async () => {
      const result = await instance.asyncMethod();
      expect(result).toBe('fallback');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should catch async error and return dynamic fallback', async () => {
      const result = await instance.asyncDynamicMethod();
      expect(result).toBe('dynamic-Async Error');
    });

    it('should not log if logError is false', async () => {
      const result = await instance.asyncNoLogMethod();
      expect(result).toBe('fallback');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should return result if no error', async () => {
      const result = await instance.asyncMethod(false);
      expect(result).toBe('success');
    });
  });

  describe('Observable Methods', () => {
    it('should catch error and return static fallback as of(fallback)', done => {
      instance.observableMethod().subscribe(val => {
        expect(val).toBe('fallback');
        expect(consoleSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should not log if logError is false', done => {
      instance.observableNoLogMethod().subscribe(val => {
        expect(val).toBe('fallback');
        expect(consoleSpy).not.toHaveBeenCalled();
        done();
      });
    });

    it('should catch error and return dynamic fallback observable', done => {
      instance.observableDynamicMethod().subscribe(val => {
        expect(val).toBe('dynamic-Observable Error');
        done();
      });
    });

    it('should re-throw original error if fallback is undefined', done => {
      instance.observableNoFallbackMethod().subscribe({
        error: err => {
          expect(err.message).toBe('Original Error');
          done();
        },
      });
    });

    it('should return result if no error', done => {
      instance.observableMethod(false).subscribe(val => {
        expect(val).toBe('success');
        done();
      });
    });
  });
});
