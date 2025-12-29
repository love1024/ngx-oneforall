import { throttle } from './throttle';
import { fakeAsync, tick } from '@angular/core/testing';

describe('throttle', () => {
  let mockFn: jest.Mock;

  class TestClass {
    @throttle(500)
    throttledMethod(...args: unknown[]) {
      mockFn(...args);
    }
  }

  beforeEach(() => {
    mockFn = jest.fn();
  });

  it('should call the decorated method immediately on the first call', fakeAsync(() => {
    const instance = new TestClass();

    instance.throttledMethod('test1');

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test1');
  }));

  it('should ignore subsequent calls within the delay period', fakeAsync(() => {
    const instance = new TestClass();

    instance.throttledMethod('test1');
    instance.throttledMethod('test2');

    // Only the first call should be executed
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test1');
  }));

  it('should allow the method to be called again after the delay period', fakeAsync(() => {
    const instance = new TestClass();

    instance.throttledMethod('test1');

    // Advance time by less than the delay
    tick(300);
    instance.throttledMethod('test2');

    // Still within the delay period, so the second call should be ignored
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Advance time to complete the delay
    tick(200);
    instance.throttledMethod('test3');

    // The method should now be called again
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('test3');
  }));

  it('should handle multiple instances independently', fakeAsync(() => {
    const instance1 = new TestClass();
    const instance2 = new TestClass();

    instance1.throttledMethod('instance1');
    instance2.throttledMethod('instance2');

    // Both instances should execute their methods independently
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('instance1');
    expect(mockFn).toHaveBeenCalledWith('instance2');
  }));

  it('should maintain the correct `this` context when called', fakeAsync(() => {
    class TestClass {
      value = 'test';

      @throttle(300)
      throttledMethod() {
        mockFn(this.value);
      }
    }

    const instance = new TestClass();
    instance.throttledMethod();

    expect(mockFn).toHaveBeenCalledWith('test');
  }));

  it('should use default delay if no delay is provided', fakeAsync(() => {
    class TestClassWithNoDelay {
      @throttle()
      throttledMethod(...args: unknown[]) {
        mockFn(...args);
      }
    }

    const instance = new TestClassWithNoDelay();

    instance.throttledMethod('test1');

    // Advance time by less than the default delay
    tick(200);
    instance.throttledMethod('test2');

    // Only the first call should be executed
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test1');
  }));

  it('should accept options object', fakeAsync(() => {
    class TestClassWithOptions {
      @throttle({ delay: 200 })
      throttledMethod(...args: unknown[]) {
        mockFn(...args);
      }
    }

    const instance = new TestClassWithOptions();
    instance.throttledMethod('test1');
    instance.throttledMethod('test2');

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test1');

    tick(200);
    instance.throttledMethod('test3');
    expect(mockFn).toHaveBeenCalledTimes(2);
  }));

  it('should use default 300ms delay when options object has no delay', fakeAsync(() => {
    class TestClassNoDelay {
      @throttle({ trailing: true })
      throttledMethod(...args: unknown[]) {
        mockFn(...args);
      }
    }

    const instance = new TestClassNoDelay();
    instance.throttledMethod('test1');

    // At 200ms - still throttled
    tick(200);
    instance.throttledMethod('test2');
    expect(mockFn).toHaveBeenCalledTimes(1);

    // At 300ms - throttle ends, trailing executes
    tick(100);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('test2');
  }));

  it('should execute on trailing edge when trailing is true', fakeAsync(() => {
    class TrailingClass {
      @throttle({ delay: 300, trailing: true })
      throttledMethod(...args: unknown[]) {
        mockFn(...args);
      }
    }

    const instance = new TrailingClass();
    instance.throttledMethod('first');
    instance.throttledMethod('second');
    instance.throttledMethod('third');

    // Leading edge - first call executes
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('first');

    // After delay - trailing edge with last args
    tick(300);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('third');
  }));

  it('should not execute on leading edge when leading is false', fakeAsync(() => {
    class TrailingOnlyClass {
      @throttle({ delay: 300, leading: false, trailing: true })
      throttledMethod(...args: unknown[]) {
        mockFn(...args);
      }
    }

    const instance = new TrailingOnlyClass();
    instance.throttledMethod('first');
    instance.throttledMethod('second');

    // No leading execution
    expect(mockFn).not.toHaveBeenCalled();

    // After delay - trailing edge
    tick(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('second');
  }));

  it('should return cached result during throttle period', fakeAsync(() => {
    class ReturnValueClass {
      callCount = 0;

      @throttle(300)
      getValue(): number {
        this.callCount++;
        return this.callCount;
      }
    }

    const instance = new ReturnValueClass();
    const result1 = instance.getValue();
    const result2 = instance.getValue();
    const result3 = instance.getValue();

    expect(result1).toBe(1);
    expect(result2).toBe(1); // Cached
    expect(result3).toBe(1); // Cached
    expect(instance.callCount).toBe(1);

    tick(300);
    const result4 = instance.getValue();
    expect(result4).toBe(2);
  }));
});
