import { isNumber, isNumberString, isNumberObject } from './is-number';

describe('isNumber', () => {
  it('should return true for finite numbers', () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(-42)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
  });

  it('should return false for non-number values', () => {
    expect(isNumber('42')).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(Infinity)).toBe(false);
    expect(isNumber(-Infinity)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
  });
});

describe('isNumberString', () => {
  it('should return true for valid number strings', () => {
    expect(isNumberString('42')).toBe(true);
    expect(isNumberString('-42')).toBe(true);
    expect(isNumberString('3.14')).toBe(true);
    expect(isNumberString('0')).toBe(true);
  });

  it('should return false for invalid number strings or non-string values', () => {
    expect(isNumberString('abc')).toBe(false);
    expect(isNumberString('42abc')).toBe(false);
    expect(isNumberString('')).toBe(false);
    expect(isNumberString(null)).toBe(false);
    expect(isNumberString(undefined)).toBe(false);
    expect(isNumberString(42)).toBe(false);
    expect(isNumberString({})).toBe(false);
    expect(isNumberString([])).toBe(false);
  });
});

describe('isNumberObject', () => {
  it('should return true for Number objects', () => {
    expect(isNumberObject(new Number(42))).toBe(true);
    expect(isNumberObject(new Number(-42))).toBe(true);
    expect(isNumberObject(new Number(3.14))).toBe(true);
  });

  it('should return false for primitive numbers or non-number objects', () => {
    expect(isNumberObject(42)).toBe(false);
    expect(isNumberObject('42')).toBe(false);
    expect(isNumberObject(null)).toBe(false);
    expect(isNumberObject(undefined)).toBe(false);
    expect(isNumberObject({})).toBe(false);
    expect(isNumberObject([])).toBe(false);
    expect(isNumberObject(new String('42'))).toBe(false);
  });
});
