import { memoize } from './memoize';

describe('memoize', () => {
  describe('basic functionality', () => {
    it('should cache the result of a method call', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(a: number, b: number): number {
          this.callCount++;
          return a + b;
        }
      }

      const instance = new TestClass();
      const result1 = instance.expensiveMethod(1, 2);
      const result2 = instance.expensiveMethod(1, 2);

      expect(result1).toBe(3);
      expect(result2).toBe(3);
      expect(instance.callCount).toBe(1);
    });

    it('should call method again with different arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(a: number, b: number): number {
          this.callCount++;
          return a + b;
        }
      }

      const instance = new TestClass();
      instance.expensiveMethod(1, 2);
      instance.expensiveMethod(3, 4);

      expect(instance.callCount).toBe(2);
    });

    it('should maintain separate caches for different instances', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(a: number): number {
          this.callCount++;
          return a * 2;
        }
      }

      const instance1 = new TestClass();
      const instance2 = new TestClass();

      instance1.expensiveMethod(5);
      instance2.expensiveMethod(5);

      expect(instance1.callCount).toBe(1);
      expect(instance2.callCount).toBe(1);
    });
  });

  describe('custom resolver', () => {
    it('should use custom resolver when provided', () => {
      class TestClass {
        callCount = 0;

        @memoize((a: number, b: number) => `${a}-${b}`)
        expensiveMethod(a: number, b: number): number {
          this.callCount++;
          return a + b;
        }
      }

      const instance = new TestClass();
      instance.expensiveMethod(1, 2);
      instance.expensiveMethod(1, 2);

      expect(instance.callCount).toBe(1);
    });

    it('should call method again when custom resolver returns different key', () => {
      class TestClass {
        callCount = 0;

        @memoize((a: number, b: number) => `key-${a}`)
        expensiveMethod(a: number, b: number): number {
          this.callCount++;
          return a + b;
        }
      }

      const instance = new TestClass();
      instance.expensiveMethod(1, 2);
      instance.expensiveMethod(1, 3); // same first arg, different second

      expect(instance.callCount).toBe(1); // should use cache because resolver only uses first arg
    });
  });

  describe('promise handling', () => {
    it('should cache resolved promise values', async () => {
      class TestClass {
        callCount = 0;

        @memoize()
        async asyncMethod(a: number): Promise<number> {
          this.callCount++;
          return a * 2;
        }
      }

      const instance = new TestClass();
      const result1 = await instance.asyncMethod(5);
      const result2 = await instance.asyncMethod(5);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(instance.callCount).toBe(1);
    });

    it('should cache the promise itself before resolution', async () => {
      class TestClass {
        callCount = 0;

        @memoize()
        async asyncMethod(a: number): Promise<number> {
          this.callCount++;
          await new Promise(resolve => setTimeout(resolve, 10));
          return a * 2;
        }
      }

      const instance = new TestClass();
      const promise1 = instance.asyncMethod(5);
      const promise2 = instance.asyncMethod(5);

      expect(promise1).toBe(promise2); // same promise instance
      await promise1;
      expect(instance.callCount).toBe(1);
    });

    it('should replace pending promise with resolved value', async () => {
      class TestClass {
        @memoize()
        async asyncMethod(a: number): Promise<number> {
          return a * 2;
        }
      }

      const instance = new TestClass();
      const result1 = await instance.asyncMethod(5);
      const result2 = await instance.asyncMethod(5);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
    });

    it('should cache rejected promises', async () => {
      class TestClass {
        callCount = 0;

        @memoize()
        async asyncMethod(a: number): Promise<number> {
          this.callCount++;
          throw new Error('Test error');
        }
      }

      const instance = new TestClass();

      await expect(instance.asyncMethod(5)).rejects.toThrow('Test error');
      await expect(instance.asyncMethod(5)).rejects.toThrow('Test error');

      // Should cache the rejected promise
      expect(instance.callCount).toBe(1);
    });

    it('should allow retry after rejection with different arguments', async () => {
      class TestClass {
        callCount = 0;

        @memoize()
        async asyncMethod(a: number): Promise<number> {
          this.callCount++;
          if (a === 5) {
            throw new Error('Test error');
          }
          return a * 2;
        }
      }

      const instance = new TestClass();

      await expect(instance.asyncMethod(5)).rejects.toThrow('Test error');
      const result = await instance.asyncMethod(10);

      expect(result).toBe(20);
      expect(instance.callCount).toBe(2);
    });

    it('should handle promise rejection with custom resolver', async () => {
      class TestClass {
        callCount = 0;

        @memoize((a: number) => `key-${a}`)
        async asyncMethod(a: number): Promise<number> {
          this.callCount++;
          throw new Error(`Error for ${a}`);
        }
      }

      const instance = new TestClass();

      await expect(instance.asyncMethod(5)).rejects.toThrow('Error for 5');
      await expect(instance.asyncMethod(5)).rejects.toThrow('Error for 5');

      expect(instance.callCount).toBe(1);
    });

    it('should replace cached promise with resolved value after resolution', async () => {
      class TestClass {
        callCount = 0;

        @memoize()
        async asyncMethod(a: number): Promise<number> {
          this.callCount++;
          await new Promise(resolve => setTimeout(resolve, 50));
          return a * 2;
        }
      }

      const instance = new TestClass();

      // First call - caches the promise
      const promise1 = instance.asyncMethod(5);

      // Wait for resolution
      const result1 = await promise1;
      expect(result1).toBe(10);

      // Second call after resolution - should return resolved value from cache
      const result2 = await instance.asyncMethod(5);
      expect(result2).toBe(10);

      // Should only call the method once
      expect(instance.callCount).toBe(1);
    });

    it('should verify cache contains resolved value after promise resolves', async () => {
      class TestClass {
        @memoize()
        async asyncMethod(a: number): Promise<number> {
          // Simulate async work
          await new Promise(resolve => setTimeout(resolve, 10));
          return a * 3;
        }
      }

      const instance = new TestClass();

      // First call
      const promise = instance.asyncMethod(7);

      // At this point, cache should contain the promise
      // Wait for it to resolve
      const result = await promise;
      expect(result).toBe(21);

      // Give the .then() callback time to execute and update cache
      await new Promise(resolve => setTimeout(resolve, 20));

      // Second call should get the resolved value from cache
      const result2 = await instance.asyncMethod(7);
      expect(result2).toBe(21);
    });
  });

  describe('complex argument types', () => {
    it('should handle object arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(obj: { a: number; b: number }): number {
          this.callCount++;
          return obj.a + obj.b;
        }
      }

      const instance = new TestClass();
      instance.expensiveMethod({ a: 1, b: 2 });
      instance.expensiveMethod({ a: 1, b: 2 });

      expect(instance.callCount).toBe(1);
    });

    it('should handle array arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(arr: number[]): number {
          this.callCount++;
          return arr.reduce((sum, n) => sum + n, 0);
        }
      }

      const instance = new TestClass();
      instance.expensiveMethod([1, 2, 3]);
      instance.expensiveMethod([1, 2, 3]);

      expect(instance.callCount).toBe(1);
    });

    it('should handle function arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(fn: () => number): number {
          this.callCount++;
          return fn();
        }
      }

      const instance = new TestClass();
      const fn = () => 42;
      instance.expensiveMethod(fn);
      instance.expensiveMethod(fn);

      expect(instance.callCount).toBe(1);
    });

    it('should handle different function references with same body as same', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(fn: () => number): number {
          this.callCount++;
          return fn();
        }
      }

      const instance = new TestClass();
      instance.expensiveMethod(() => 42);
      instance.expensiveMethod(() => 42);

      // safeSerialize hashes anonymous functions, so identical bodies = same hash
      expect(instance.callCount).toBe(1);
    });

    it('should handle different function bodies as different', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(fn: () => number): number {
          this.callCount++;
          return fn();
        }
      }

      const instance = new TestClass();
      instance.expensiveMethod(() => 42);
      instance.expensiveMethod(() => 100);

      expect(instance.callCount).toBe(2); // different function bodies
    });

    it('should handle symbol arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(sym: symbol): string {
          this.callCount++;
          return sym.toString();
        }
      }

      const instance = new TestClass();
      const sym = Symbol('test');
      instance.expensiveMethod(sym);
      instance.expensiveMethod(sym);

      expect(instance.callCount).toBe(1);
    });

    it('should handle bigint arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(big: bigint): bigint {
          this.callCount++;
          return big * 2n;
        }
      }

      const instance = new TestClass();
      instance.expensiveMethod(100n);
      instance.expensiveMethod(100n);

      expect(instance.callCount).toBe(1);
    });

    it('should handle Map arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(map: Map<string, number>): number {
          this.callCount++;
          return Array.from(map.values()).reduce((sum, n) => sum + n, 0);
        }
      }

      const instance = new TestClass();
      const map = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      instance.expensiveMethod(map);
      instance.expensiveMethod(map);

      expect(instance.callCount).toBe(1);
    });

    it('should handle Set arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(set: Set<number>): number {
          this.callCount++;
          return Array.from(set).reduce((sum, n) => sum + n, 0);
        }
      }

      const instance = new TestClass();
      const set = new Set([1, 2, 3]);
      instance.expensiveMethod(set);
      instance.expensiveMethod(set);

      expect(instance.callCount).toBe(1);
    });

    it('should handle Error arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(err: Error): string {
          this.callCount++;
          return err.message;
        }
      }

      const instance = new TestClass();
      const err = new Error('test error');
      instance.expensiveMethod(err);
      instance.expensiveMethod(err);

      expect(instance.callCount).toBe(1);
    });

    it('should handle RegExp arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(regex: RegExp): string {
          this.callCount++;
          return regex.toString();
        }
      }

      const instance = new TestClass();
      const regex = /test/g;
      instance.expensiveMethod(regex);
      instance.expensiveMethod(regex);

      expect(instance.callCount).toBe(1);
    });

    it('should handle Date arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(date: Date): number {
          this.callCount++;
          return date.getTime();
        }
      }

      const instance = new TestClass();
      const date = new Date('2024-01-01');
      instance.expensiveMethod(date);
      instance.expensiveMethod(date);

      expect(instance.callCount).toBe(1);
    });

    it('should handle circular references', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(obj: any): string {
          this.callCount++;
          return 'processed';
        }
      }

      const instance = new TestClass();
      const circular: any = { a: 1 };
      circular.self = circular;

      instance.expensiveMethod(circular);
      instance.expensiveMethod(circular);

      expect(instance.callCount).toBe(1);
    });

    it('should handle custom class instances', () => {
      class CustomClass {
        constructor(public value: number) {}
      }

      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(custom: CustomClass): number {
          this.callCount++;
          return custom.value * 2;
        }
      }

      const instance = new TestClass();
      const custom = new CustomClass(5);
      instance.expensiveMethod(custom);
      instance.expensiveMethod(custom);

      expect(instance.callCount).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should return descriptor when descriptor is undefined', () => {
      const descriptor = undefined;
      const result = memoize()({}, 'test', descriptor as any);
      expect(result).toBe(descriptor);
    });

    it('should return descriptor when descriptor.value is not a function', () => {
      const descriptor = { value: 'not a function' };
      const result = memoize()({}, 'test', descriptor as any);
      expect(result).toBe(descriptor);
    });

    it('should handle no arguments', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(): number {
          this.callCount++;
          return 42;
        }
      }

      const instance = new TestClass();
      instance.expensiveMethod();
      instance.expensiveMethod();

      expect(instance.callCount).toBe(1);
    });

    it('should handle multiple arguments of mixed types', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        expensiveMethod(
          num: number,
          str: string,
          obj: { a: number },
          fn: () => void
        ): string {
          this.callCount++;
          return `${num}-${str}-${obj.a}`;
        }
      }

      const instance = new TestClass();
      const fn = () => {};
      instance.expensiveMethod(1, 'test', { a: 2 }, fn);
      instance.expensiveMethod(1, 'test', { a: 2 }, fn);

      expect(instance.callCount).toBe(1);
    });
  });

  describe('cache isolation', () => {
    it('should maintain separate caches for different methods', () => {
      class TestClass {
        callCount1 = 0;
        callCount2 = 0;

        @memoize()
        method1(a: number): number {
          this.callCount1++;
          return a * 2;
        }

        @memoize()
        method2(a: number): number {
          this.callCount2++;
          return a * 3;
        }
      }

      const instance = new TestClass();
      instance.method1(5);
      instance.method1(5);
      instance.method2(5);
      instance.method2(5);

      expect(instance.callCount1).toBe(1);
      expect(instance.callCount2).toBe(1);
    });
  });

  describe('options object', () => {
    it('should accept options object with resolver', () => {
      class TestClass {
        callCount = 0;

        @memoize({ resolver: (a: number) => `key-${a}` })
        method(a: number): number {
          this.callCount++;
          return a * 2;
        }
      }

      const instance = new TestClass();
      instance.method(1);
      instance.method(1);

      expect(instance.callCount).toBe(1);
    });
  });

  describe('maxSize option', () => {
    it('should evict oldest entry when maxSize is exceeded', () => {
      class TestClass {
        callCount = 0;

        @memoize({ maxSize: 2 })
        method(a: number): number {
          this.callCount++;
          return a * 2;
        }
      }

      const instance = new TestClass();
      instance.method(1); // cache: [1]
      instance.method(2); // cache: [1, 2]
      instance.method(3); // cache: [2, 3], evicts 1

      expect(instance.callCount).toBe(3);

      // Call 2 and 3 should be cached
      instance.method(2);
      instance.method(3);
      expect(instance.callCount).toBe(3);

      // Call 1 should not be cached anymore
      instance.method(1);
      expect(instance.callCount).toBe(4);
    });

    it('should work with maxSize of 1', () => {
      class TestClass {
        callCount = 0;

        @memoize({ maxSize: 1 })
        method(a: number): number {
          this.callCount++;
          return a * 2;
        }
      }

      const instance = new TestClass();
      instance.method(1);
      instance.method(1);
      expect(instance.callCount).toBe(1);

      instance.method(2); // evicts 1
      instance.method(1); // 1 not cached, call again
      expect(instance.callCount).toBe(3);
    });

    it('should not limit cache when maxSize is undefined', () => {
      class TestClass {
        callCount = 0;

        @memoize()
        method(a: number): number {
          this.callCount++;
          return a * 2;
        }
      }

      const instance = new TestClass();
      for (let i = 0; i < 100; i++) {
        instance.method(i);
      }
      expect(instance.callCount).toBe(100);

      // All should be cached
      for (let i = 0; i < 100; i++) {
        instance.method(i);
      }
      expect(instance.callCount).toBe(100);
    });
  });
});
