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
});
