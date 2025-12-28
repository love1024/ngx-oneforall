import { MemoizePipe } from './memoize.pipe';

describe('MemoizePipe', () => {
  let pipe: MemoizePipe;

  beforeEach(() => {
    pipe = new MemoizePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should call the handler function with the provided arguments', () => {
    const handler = jest.fn((a: number, b: number) => a + b);
    const result = pipe.transform(handler, null, 5, 10);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(5, 10);
    expect(result).toBe(15);
  });

  it('should bind the handler function to the provided context', () => {
    const context = { multiplier: 2 };
    const handler = function (a: number, b: number) {
      return (a + b) * context.multiplier;
    };

    const result = pipe.transform(handler, context, 5, 10);

    expect(result).toBe(30); // (5 + 10) * 2
  });

  it('should handle functions with no arguments', () => {
    const handler = jest.fn(() => 'no args');
    const result = pipe.transform(handler);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(result).toBe('no args');
  });

  it('should handle functions with multiple arguments', () => {
    const handler = jest.fn((...args: number[]) =>
      args.reduce((sum, num) => sum + num, 0)
    );
    const result = pipe.transform(handler, null, 1, 2, 3, 4, 5);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(1, 2, 3, 4, 5);
    expect(result).toBe(15);
  });

  it('should return the correct result when no context is provided', () => {
    const handler = jest.fn((a: number, b: number) => a * b);
    const result = pipe.transform(handler, undefined, 6, 7);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(6, 7);
    expect(result).toBe(42);
  });

  it('should throw an error if the handler is not a function', () => {
    expect(() => {
      pipe.transform(null as unknown as () => void, null);
    }).toThrow(TypeError);
  });
});
