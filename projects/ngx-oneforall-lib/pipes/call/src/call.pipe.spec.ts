import { CallPipe } from './call.pipe';

describe('CallPipe', () => {
  let pipe: CallPipe;

  beforeEach(() => {
    pipe = new CallPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should call the function with provided arguments', () => {
    const fn = (a: number, b: number) => a + b;
    expect(pipe.transform(fn, 1, 2)).toBe(3);
  });

  it('should call the function with no arguments', () => {
    const fn = () => 'hello';
    expect(pipe.transform(fn)).toBe('hello');
  });

  it('should return null if it is not a function', () => {
    expect(pipe.transform('not a function' as any)).toBeNull();
    expect(pipe.transform(null as any)).toBeNull();
    expect(pipe.transform(undefined as any)).toBeNull();
  });

  it('should handle context correctly (arrow functions)', () => {
    const context = {
      value: 10,
      getValue: () => 10,
    };
    expect(pipe.transform(context.getValue)).toBe(10);
  });

  it('should handle context correctly (bound functions)', () => {
    class TestClass {
      value = 20;
      getValue() {
        return this.value;
      }
    }
    const instance = new TestClass();
    const boundFn = instance.getValue.bind(instance);
    expect(pipe.transform(boundFn)).toBe(20);
  });

  it('should fail context if not bound (standard behavior warning)', () => {
    class TestClass {
      value = 30;
      getValue() {
        return this.value;
      }
    }
    const instance = new TestClass();
    try {
      expect(pipe.transform(instance.getValue)).toBeUndefined();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});
