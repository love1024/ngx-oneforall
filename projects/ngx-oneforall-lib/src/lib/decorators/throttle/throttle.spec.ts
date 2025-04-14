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
});
