import { isRecord } from './is-record';

describe('isRecord', () => {
  it('should return true for plain objects', () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord({ a: 1 })).toBe(true);
    expect(isRecord(new Object())).toBe(true);
  });

  it('should return true for null-prototype objects', () => {
    const obj = Object.create(null);
    expect(isRecord(obj)).toBe(true);
  });

  it('should return false for null and undefined', () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord(undefined)).toBe(false);
  });

  it('should return false for primitives', () => {
    expect(isRecord(1)).toBe(false);
    expect(isRecord('string')).toBe(false);
    expect(isRecord(true)).toBe(false);
    expect(isRecord(Symbol())).toBe(false);
  });

  it('should return false for arrays', () => {
    expect(isRecord([])).toBe(false);
    expect(isRecord([1, 2, 3])).toBe(false);
  });

  it('should return false for built-ins', () => {
    expect(isRecord(new Date())).toBe(false);
    expect(isRecord(/abc/)).toBe(false);
    expect(isRecord(new Map())).toBe(false);
    expect(isRecord(new Set())).toBe(false);
    expect(isRecord(new Error())).toBe(false);
    expect(isRecord(Promise.resolve())).toBe(false);
    expect(isRecord(new WeakMap())).toBe(false);
    expect(isRecord(new WeakSet())).toBe(false);
  });

  it('should return false for class instances', () => {
    class TestClass {}
    expect(isRecord(new TestClass())).toBe(false);
  });

  it('should return false for objects inheriting from non-Object', () => {
    const date = new Date();
    const obj = Object.create(date);
    expect(isRecord(obj)).toBe(false);
  });
});
