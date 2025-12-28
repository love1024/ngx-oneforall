import { isKeyDefined } from './is-key-defined';

describe('isKeyDefined', () => {
  it('should return true if the object has the key and value is not undefined (own property)', () => {
    const obj = { a: 1, b: 2 };
    expect(isKeyDefined(obj, 'a')).toBe(true);
    expect(isKeyDefined(obj, 'b')).toBe(true);
  });

  it('should return false if the object does not have the key (own property)', () => {
    const obj: { a: number; b?: number } = { a: 1 };
    expect(isKeyDefined(obj, 'b')).toBe(false);
  });

  it('should return false if the key exists but value is undefined (own property)', () => {
    const obj = { a: 1, b: undefined };
    expect(isKeyDefined(obj, 'b')).toBe(false);
  });

  it('should return true for inherited property if ownPropertyOnly is false and value is not undefined', () => {
    const base = { a: 1 };
    const derived = Object.create(base);
    derived.b = 2;
    expect(isKeyDefined(derived, 'a', false)).toBe(true);
    expect(isKeyDefined(derived, 'b', false)).toBe(true);
  });

  it('should return false for inherited property if ownPropertyOnly is true', () => {
    const base = { a: 1 };
    const derived = Object.create(base);
    derived.b = 2;
    expect(isKeyDefined(derived, 'a', true)).toBe(false);
    expect(isKeyDefined(derived, 'b', true)).toBe(true);
  });

  it('should return false if inherited property value is undefined', () => {
    const base = { a: undefined };
    const derived = Object.create(base);
    expect(isKeyDefined(derived, 'a', false)).toBe(false);
  });
});
