import { LogExecutionTime } from './log-execution-time';

describe('LogExecutionTime Decorator', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      // Empty
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  class MockComponent {
    @LogExecutionTime()
    syncMethod(): string {
      // Simulate some work
      for (let i = 0; i < 100000; i++) {
        // Do nothing
      }
      return 'sync';
    }

    @LogExecutionTime('CustomLabel')
    async asyncMethod(): Promise<string> {
      // Simulate async work
      return new Promise(resolve => setTimeout(() => resolve('async'), 10));
    }

    @LogExecutionTime()
    async asyncMethodWithoutLabel(): Promise<string> {
      // Simulate async work
      return new Promise(resolve => setTimeout(() => resolve('async'), 10));
    }
  }

  it('should log execution time for synchronous method', () => {
    const comp = new MockComponent();
    const result = comp.syncMethod();
    expect(result).toBe('sync');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[syncMethod\] executed in \d+\.\d{2} ms/)
    );
  });

  it('should log execution time for asynchronous method with custom label', async () => {
    const comp = new MockComponent();
    const result = await comp.asyncMethod();

    expect(result).toBe('async');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/\[CustomLabel\] executed in \d+\.\d{2} ms/)
    );
  });

  it('should take  method name for async function if no label is provided', async () => {
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
