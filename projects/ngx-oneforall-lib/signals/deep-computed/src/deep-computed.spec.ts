/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { signal } from '@angular/core';
import { deepComputed } from './deep-computed';

describe('deepComputed', () => {
  it('should create a deep computed signal from a factory', () => {
    const source = signal({ a: 1, b: { c: 2 } });
    const computed = deepComputed(() => source());

    expect(computed().a).toBe(1);
    expect(computed().b.c).toBe(2);
  });

  it('should allow accessing nested properties as signals', () => {
    const source = signal({ a: 1, b: { c: 2 } });
    const computed = deepComputed(() => source());

    expect(computed.a()).toBe(1);
    expect(computed.b.c()).toBe(2);
  });

  it('should react to source signal changes', () => {
    const source = signal({ a: 1, b: { c: 2 } });
    const computed = deepComputed(() => source());

    expect(computed.a()).toBe(1);
    expect(computed.b.c()).toBe(2);

    source.set({ a: 10, b: { c: 20 } });

    expect(computed.a()).toBe(10);
    expect(computed.b.c()).toBe(20);
  });

  it('should handle the "has" trap', () => {
    const source = signal({
      a: 1,
      b: { c: 2 },
    });
    const computed = deepComputed(() => source());

    expect('a' in computed).toBe(true);
    expect('b' in computed).toBe(true);
    expect('c' in computed.b).toBe(true);
    expect('d' in computed).toBe(false);
  });

  it('should handle non-record values', () => {
    const source = signal(123 as any);
    const computed = deepComputed(() => source());

    expect(computed()).toBe(123);
    // @ts-expect-error - property access on non-record
    expect(computed.a).toBeUndefined();
  });

  it('should handle property not in value', () => {
    const source = signal({ a: 1 });
    const computed = deepComputed(() => source());

    expect((computed as any).b).toBeUndefined();
  });

  it('should handle property removal and re-addition gracefully', () => {
    const source = signal({ a: { b: 1 } });
    const computed = deepComputed(() => source());

    expect(computed.a.b()).toBe(1);

    source.set({} as any);
    expect(computed.a).toBeUndefined();

    source.set({ a: { b: 2 } });
    expect(computed.a.b()).toBe(2);
  });

  it('should handle arrays', () => {
    const source = signal([1, 2, 3]);
    const computed = deepComputed(() => source());

    expect(computed()[0]).toBe(1);
    // Note: DeepComputed model says number extends keyof T -> Signal<T[K]>
    // So computed[0] should be a signal if it's an array?
    // Actually IsUnsafeToRecurse handles arrays.
    expect(computed[0]).toBeUndefined(); // Proxy get trap checks isRecord(value) && (prop in value)
    // Array is a record in JS, but 0 is a property.
  });

  it('should handle Date (Builtin)', () => {
    const now = new Date();
    const source = signal({ date: now });
    const computed = deepComputed(() => source());

    expect(computed.date()).toBe(now);
    // Date is not a record for recursion
    expect((computed.date as any).getTime).toBeUndefined();
  });

  it('should handle symbols', () => {
    const sym = Symbol('test');
    const source = signal({ [sym]: 1 } as any);
    const computed = deepComputed(() => source());

    expect(computed()[sym]).toBe(1);
    expect((computed as any)[sym]()).toBe(1);
  });

  it('should handle the "has" trap for removed properties', () => {
    const source = signal({ a: 1 } as any);
    const computed = deepComputed(() => source());

    expect('a' in computed).toBe(true);

    source.set({});
    expect('a' in computed).toBe(false);
  });

  it('should handle properties already on target that are not signals', () => {
    const source = signal({ toString: () => 'custom' } as any);
    const computed = deepComputed(() => source());

    // toString is on the target (Signal/Function prototype)
    // But it's also in the value.
    // The proxy should return the one from the value as a signal.
    expect(typeof computed.toString).toBe('function');
    expect(computed.toString()).toBe(source().toString); // target[prop] for toString exists but is not computed
  });

  it('should work when isDevMode is false', () => {
    jest.isolateModules(() => {
      jest.doMock('@angular/core', () => ({
        __esModule: true,
        ...jest.requireActual('@angular/core'),
        isDevMode: () => false,
      }));

      const { deepComputed: isolatedDeepComputed } = require('./deep-computed');
      const isolatedSource = signal({ a: 1 });
      const computed = isolatedDeepComputed(() => isolatedSource());

      expect(computed.a()).toBe(1);
    });
  });
});
