import { FormControl } from '@angular/forms';
import { minLengthTrimmed } from './min-length-trimmed.validator';

describe('minLengthTrimmed', () => {
  it('should return null for null value', () => {
    const validator = minLengthTrimmed(3);
    expect(validator(new FormControl(null))).toBeNull();
  });

  it('should return null for undefined value', () => {
    const validator = minLengthTrimmed(3);
    expect(validator(new FormControl(undefined))).toBeNull();
  });

  it('should return null for non-string values', () => {
    const validator = minLengthTrimmed(3);
    expect(validator(new FormControl(123))).toBeNull();
    expect(validator(new FormControl({}))).toBeNull();
  });

  it('should return null when trimmed length meets minimum', () => {
    const validator = minLengthTrimmed(3);
    expect(validator(new FormControl('abc'))).toBeNull();
    expect(validator(new FormControl('abcd'))).toBeNull();
    expect(validator(new FormControl('  abc  '))).toBeNull();
  });

  it('should return error when trimmed length is below minimum', () => {
    const validator = minLengthTrimmed(3);
    expect(validator(new FormControl('ab'))).toEqual({
      minLengthTrimmed: { requiredLength: 3, actualLength: 2 },
    });
    expect(validator(new FormControl('  ab  '))).toEqual({
      minLengthTrimmed: { requiredLength: 3, actualLength: 2 },
    });
  });

  it('should return error for empty string', () => {
    const validator = minLengthTrimmed(1);
    expect(validator(new FormControl(''))).toEqual({
      minLengthTrimmed: { requiredLength: 1, actualLength: 0 },
    });
  });

  it('should return error for whitespace-only string', () => {
    const validator = minLengthTrimmed(1);
    expect(validator(new FormControl('   '))).toEqual({
      minLengthTrimmed: { requiredLength: 1, actualLength: 0 },
    });
  });

  it('should work with minLength of 0', () => {
    const validator = minLengthTrimmed(0);
    expect(validator(new FormControl(''))).toBeNull();
    expect(validator(new FormControl('   '))).toBeNull();
  });
});
