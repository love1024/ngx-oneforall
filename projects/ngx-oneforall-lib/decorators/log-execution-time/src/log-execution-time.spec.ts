import {
  LogExecutionTime,
  disableLogExecutionTime,
  enableLogExecutionTime,
  isLogExecutionTimeEnabled,
} from './log-execution-time';
import { of, delay } from 'rxjs';

describe('LogExecutionTime Decorator', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      // Empty
    });
    enableLogExecutionTime(); // Ensure enabled for each test
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  class MockComponent {
    @LogExecutionTime()
    syncMethod(): string {
      for (let i = 0; i < 100000; i++) {
        // Simulate work
      }
      return 'sync';
    }

    @LogExecutionTime('CustomLabel')
    async asyncMethod(): Promise<string> {
      return new Promise(resolve => setTimeout(() => resolve('async'), 10));
    }

    @LogExecutionTime()
    async asyncMethodWithoutLabel(): Promise<string> {
      return new Promise(resolve => setTimeout(() => resolve('async'), 10));
    }

    @LogExecutionTime('ObservableMethod')
    observableMethod() {
      return of('observable').pipe(delay(10));
    }

    @LogExecutionTime()
    observableMethodWithoutLabel() {
      return of('observable');
    }
  }

  describe('sync methods', () => {
    it('should log execution time for synchronous method', () => {
      const comp = new MockComponent();
      const result = comp.syncMethod();
      expect(result).toBe('sync');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[syncMethod\] executed in \d+\.\d{2} ms/)
      );
    });
  });

  describe('async methods', () => {
    it('should log execution time for asynchronous method with custom label', async () => {
      const comp = new MockComponent();
      const result = await comp.asyncMethod();

      expect(result).toBe('async');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[CustomLabel\] executed in \d+\.\d{2} ms/)
      );
    });

    it('should use method name as label when not provided', async () => {
      const comp = new MockComponent();
      const result = await comp.asyncMethodWithoutLabel();

      expect(result).toBe('async');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /\[asyncMethodWithoutLabel\] executed in \d+\.\d{2} ms/
        )
      );
    });
  });

  describe('observable methods', () => {
    it('should log execution time for Observable with custom label', done => {
      const comp = new MockComponent();
      let value: string;

      comp.observableMethod().subscribe({
        next: result => {
          value = result;
        },
        complete: () => {
          setTimeout(() => {
            expect(value).toBe('observable');
            expect(consoleSpy).toHaveBeenCalledWith(
              expect.stringMatching(
                /\[ObservableMethod\] executed in \d+\.\d{2} ms/
              )
            );
            done();
          }, 0);
        },
      });
    });

    it('should use method name as label for Observable when not provided', done => {
      const comp = new MockComponent();
      let value: string;

      comp.observableMethodWithoutLabel().subscribe({
        next: result => {
          value = result;
        },
        complete: () => {
          setTimeout(() => {
            expect(value).toBe('observable');
            expect(consoleSpy).toHaveBeenCalledWith(
              expect.stringMatching(
                /\[observableMethodWithoutLabel\] executed in \d+\.\d{2} ms/
              )
            );
            done();
          }, 0);
        },
      });
    });
  });

  describe('enable/disable', () => {
    it('should not log when disabled', () => {
      disableLogExecutionTime();
      const comp = new MockComponent();
      const result = comp.syncMethod();
      expect(result).toBe('sync');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should log when re-enabled', () => {
      disableLogExecutionTime();
      enableLogExecutionTime();
      const comp = new MockComponent();
      comp.syncMethod();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should correctly report enabled state', () => {
      expect(isLogExecutionTimeEnabled()).toBe(true);
      disableLogExecutionTime();
      expect(isLogExecutionTimeEnabled()).toBe(false);
      enableLogExecutionTime();
      expect(isLogExecutionTimeEnabled()).toBe(true);
    });
  });
});
