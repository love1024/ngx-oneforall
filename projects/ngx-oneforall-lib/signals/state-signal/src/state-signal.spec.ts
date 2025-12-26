import { computed, effect, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { stateSignal } from './state-signal';

describe('stateSignal', () => {
  it('should create a state signal from an initial value', () => {
    const s = stateSignal({ a: 1, b: { c: 2 } });

    expect(s().a).toBe(1);
    expect(s().b.c).toBe(2);
  });

  it('should accept a WritableSignal as the initial value', () => {
    const source = signal({ a: 1, b: { c: 2 } });
    const s = stateSignal(source);

    expect(s().a).toBe(1);
    expect(s.b.c()).toBe(2);

    // Updating via the state signal should update the source
    s.a.set(10);
    expect(source().a).toBe(10);

    // Updating the source directly is reflected when reading via s()
    source.set({ a: 20, b: { c: 30 } });
    expect(s().a).toBe(20);
    expect(s().b.c).toBe(30);
  });

  it('should allow accessing nested properties as signals', () => {
    const s = stateSignal({ a: 1, b: { c: 2 } });

    expect(s.a()).toBe(1);
    expect(s.b.c()).toBe(2);
  });

  it('should update the root signal when a nested property is updated via .set()', () => {
    const s = stateSignal({ a: 1, b: { c: 2 } });

    s.a.set(10);
    expect(s().a).toBe(10);
    expect(s.a()).toBe(10);

    s.b.c.set(20);
    expect(s().b.c).toBe(20);
    expect(s.b.c()).toBe(20);
  });

  it('should update the root signal when a nested property is updated via .update()', () => {
    const s = stateSignal({ a: 1, b: { c: 2 } });

    s.a.update(v => v + 1);
    expect(s().a).toBe(2);

    s.b.c.update(v => v * 10);
    expect(s().b.c).toBe(20);
  });

  it('should be reactive to nested updates', () => {
    const s = stateSignal({ a: 1 });
    const doubleA = computed(() => (s().a as number) * 2);

    expect(doubleA()).toBe(2);

    s.a.set(10);
    expect(doubleA()).toBe(20);

    s.a.update(v => (v as number) + 5);
    expect(doubleA()).toBe(30);
  });

  it('should handle arrays as single signals (no recursion into elements)', () => {
    const s = stateSignal({ list: [1, 2, 3] });

    // Array is accessible as a signal
    expect(s.list()[0]).toBe(1);

    // Array elements are NOT state signals (no recursion into arrays)
    expect((s.list as any)[0]).toBeUndefined();

    // Update the whole array via .set()
    s.list.set([10, 2, 3]);
    expect(s().list[0]).toBe(10);
    expect(s.list()[0]).toBe(10);
  });

  it('should handle property removal and re-addition gracefully', () => {
    const s = stateSignal({ a: { b: 1 } } as any);

    expect((s as any).a.b()).toBe(1);

    s.set({});
    expect((s as any).a).toBeUndefined();

    s.set({ a: { b: 2 } });
    expect((s as any).a.b()).toBe(2);
  });

  it('should handle "has" trap', () => {
    const s = stateSignal({ a: 1, b: { c: 2 } } as any);

    expect('a' in s).toBe(true);
    expect('b' in s).toBe(true);
    expect('c' in (s as any).b).toBe(true);
    expect('d' in s).toBe(false);
  });

  it('should handle symbols', () => {
    const sym = Symbol('test');
    const s = stateSignal({ [sym]: 1 } as any);

    expect(s()[sym]).toBe(1);
    expect((s as any)[sym]()).toBe(1);
  });
  it('should provide asReadonly() for nested signals', () => {
    const s = stateSignal({ a: 1 });
    const readonlyA = (s as any).a.asReadonly();

    expect(readonlyA()).toBe(1);
    expect((readonlyA as any).set).toBeUndefined();

    (s as any).a.set(2);
    expect(readonlyA()).toBe(2);
  });

  it('should not delete properties from target that are not state signals', () => {
    const s = stateSignal({ a: 1 } as any);
    (s as any).manual = signal(1);

    expect((s as any).manual()).toBe(1);

    s.set({ b: 2 });
    // This triggers get trap for 'manual'. value is {b:2}, 'manual' is not in value.
    // target['manual'] is a signal, but doesn't have [STATE_SIGNAL].
    expect((s as any).manual()).toBe(1);
  });

  it('should work when isDevMode is false', () => {
    jest.isolateModules(() => {
      jest.doMock('@angular/core', () => ({
        __esModule: true,
        ...jest.requireActual('@angular/core'),
        isDevMode: () => false,
      }));

      const { stateSignal: isolatedStateSignal } = require('./state-signal');
      const s = isolatedStateSignal({ a: 1 });

      expect(s.a()).toBe(1);
    });
  });
});
