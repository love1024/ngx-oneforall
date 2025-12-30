import { FormControl, Validators } from '@angular/forms';
import { range } from './range.validator';

describe('range', () => {
  it('should return null for null/undefined values', () => {
    const validator = range(5, 10);
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(undefined))).toBeNull();
  });

  it('should throw error if min is greater than max', () => {
    expect(() => range(10, 5)).toThrow(
      '[RangeValidator] min must be less than or equal to max'
    );
  });

  it('should return null for valid numbers (inclusive)', () => {
    const validator = range(5, 10);
    expect(validator(new FormControl(5))).toBeNull();
    expect(validator(new FormControl(10))).toBeNull();
    expect(validator(new FormControl(7))).toBeNull();
  });

  it('should return error for invalid numbers', () => {
    const validator = range(5, 10);

    expect(validator(new FormControl(4))).toEqual({
      range: { min: 5, max: 10, actualValue: 4 },
    });

    expect(validator(new FormControl(11))).toEqual({
      range: { min: 5, max: 10, actualValue: 11 },
    });
  });

  it('should handle string numbers by converting them', () => {
    const validator = range(5, 10);
    expect(validator(new FormControl('5'))).toBeNull();
    expect(validator(new FormControl('10'))).toBeNull();

    expect(validator(new FormControl('4'))).toEqual({
      range: { min: 5, max: 10, actualValue: 4 },
    });
  });

  it('should return null for non-numeric strings', () => {
    const validator = range(5, 10);
    expect(validator(new FormControl('abc'))).toBeNull();
  });
});
