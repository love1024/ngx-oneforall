import {
  isNumberValue,
  isNumberString,
  isNumberObject,
  isNumeric,
} from './is-number';

describe('isNumberValue', () => {
  it('should return true for finite numbers', () => {
    expect(isNumberValue(42)).toBe(true);
    expect(isNumberValue(-42)).toBe(true);
    expect(isNumberValue(0)).toBe(true);
    expect(isNumberValue(3.14)).toBe(true);
  });

  it('should return false for non-number values', () => {
    expect(isNumberValue('42')).toBe(false);
    expect(isNumberValue(null)).toBe(false);
    expect(isNumberValue(undefined)).toBe(false);
    expect(isNumberValue(NaN)).toBe(false);
    expect(isNumberValue(Infinity)).toBe(false);
    expect(isNumberValue(-Infinity)).toBe(false);
    expect(isNumberValue({})).toBe(false);
    expect(isNumberValue([])).toBe(false);
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

describe('isNumeric', () => {
  it('should return true for valid number strings', () => {
    expect(isNumeric('42')).toBe(true);
    expect(isNumeric('-42')).toBe(true);
    expect(isNumeric('3.14')).toBe(true);
    expect(isNumeric('0')).toBe(true);
  });

  it('should return false for invalid number strings or non-string values', () => {
    expect(isNumeric('abc')).toBe(false);
    expect(isNumeric('42abc')).toBe(false);
    expect(isNumeric('')).toBe(false);
    expect(isNumeric(null)).toBe(false);
    expect(isNumeric(undefined)).toBe(false);
    expect(isNumeric({})).toBe(false);
    expect(isNumeric([])).toBe(false);
  });
});
