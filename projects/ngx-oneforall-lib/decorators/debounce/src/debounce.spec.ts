import { debounce } from './debounce';
import { fakeAsync, tick } from '@angular/core/testing';

describe('debounce', () => {
  let mockFn: jest.Mock;

  class TestClass {
    @debounce()
    debouncedMethod(...args: unknown[]) {
      mockFn(...args);
    }
  }

  beforeEach(() => {
    mockFn = jest.fn();
  });

  it('should call the decorated method after the specified delay', fakeAsync(() => {
    const instance = new TestClass();

    instance.debouncedMethod('test1');
    instance.debouncedMethod('test2');

    // Method should not be called immediately
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time by 500ms
    tick(300);

    // Method should be called once with the last arguments
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test2');
  }));

  it('should reset the debounce timer if the method is called again within the delay', fakeAsync(() => {
    const instance = new TestClass();

    instance.debouncedMethod('test1');
    tick(100); // Advance time by less than the delay
    instance.debouncedMethod('test2');

    // Method should not be called yet
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time by 500ms from the last call
    tick(300);

    // Method should be called once with the last arguments
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test2');
  }));

  it('should handle multiple instances independently', fakeAsync(() => {
    const instance1 = new TestClass();
    const instance2 = new TestClass();

    instance1.debouncedMethod('instance1');
    instance2.debouncedMethod('instance2');

    // Fast-forward time by 500ms
    tick(300);

    // Both methods should be called independently
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('instance1');
    expect(mockFn).toHaveBeenCalledWith('instance2');
  }));

  it('should not call the method if it is not invoked again after the delay', fakeAsync(() => {
    const instance = new TestClass();

    instance.debouncedMethod('test1');
    tick(100); // Advance time by less than the delay

    // Method should not be called yet
    expect(mockFn).not.toHaveBeenCalled();

    tick(200); // Advance time to complete the delay

    // Method should now be called
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test1');
  }));

  describe('options object', () => {
    it('should accept options object with delay', fakeAsync(() => {
      class TestWithOptions {
        @debounce({ delay: 500 })
        method() {
          mockFn();
        }
      }
      const instance = new TestWithOptions();

      instance.method();
      tick(300);
      expect(mockFn).not.toHaveBeenCalled();

      tick(200);
      expect(mockFn).toHaveBeenCalledTimes(1);
    }));

    it('should default to 300ms delay when options.delay is not provided', fakeAsync(() => {
      class TestWithoutDelay {
        @debounce({ leading: false })
        method() {
          mockFn();
        }
      }
      const instance = new TestWithoutDelay();

      instance.method();
      tick(200);
      expect(mockFn).not.toHaveBeenCalled();

      tick(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    }));
  });

  describe('leading edge', () => {
    class LeadingTestClass {
      @debounce({ delay: 300, leading: true })
      leadingMethod(...args: unknown[]) {
        mockFn(...args);
      }
    }

    it('should execute immediately on first call when leading is true', fakeAsync(() => {
      const instance = new LeadingTestClass();

      instance.leadingMethod('first');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      tick(300);
    }));

    it('should not execute again during debounce period when leading is true', fakeAsync(() => {
      const instance = new LeadingTestClass();

      instance.leadingMethod('first');
      expect(mockFn).toHaveBeenCalledTimes(1);

      instance.leadingMethod('second');
      instance.leadingMethod('third');
      expect(mockFn).toHaveBeenCalledTimes(1); // Still only first call

      tick(300);
      expect(mockFn).toHaveBeenCalledTimes(1); // No trailing call
    }));

    it('should allow new leading call after delay resets', fakeAsync(() => {
      const instance = new LeadingTestClass();

      instance.leadingMethod('first');
      expect(mockFn).toHaveBeenCalledTimes(1);

      tick(300); // Wait for delay to reset

      instance.leadingMethod('second');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('second');

      tick(300);
    }));
  });

  describe('return value caching', () => {
    it('should return cached result', fakeAsync(() => {
      class ReturnTestClass {
        @debounce(300)
        getValue(): string {
          mockFn();
          return 'result';
        }
      }
      const instance = new ReturnTestClass();

      const result1 = instance.getValue();
      expect(result1).toBeUndefined(); // No cached value yet

      tick(300);
      const result2 = instance.getValue();
      expect(result2).toBe('result'); // Returns cached value

      tick(300);
    }));
  });
});
