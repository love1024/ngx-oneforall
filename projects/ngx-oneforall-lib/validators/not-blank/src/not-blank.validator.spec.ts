import { FormControl } from '@angular/forms';
import { notBlank } from './not-blank.validator';

describe('notBlank', () => {
  it('should return null for null value', () => {
    expect(notBlank(new FormControl(null))).toBeNull();
  });

  it('should return null for undefined value', () => {
    expect(notBlank(new FormControl(undefined))).toBeNull();
  });

  it('should return null for non-string values', () => {
    expect(notBlank(new FormControl(123))).toBeNull();
    expect(notBlank(new FormControl(0))).toBeNull();
    expect(notBlank(new FormControl(false))).toBeNull();
    expect(notBlank(new FormControl({}))).toBeNull();
    expect(notBlank(new FormControl([]))).toBeNull();
  });

  it('should return null for valid non-blank strings', () => {
    expect(notBlank(new FormControl('hello'))).toBeNull();
    expect(notBlank(new FormControl('  hello  '))).toBeNull();
    expect(notBlank(new FormControl('a'))).toBeNull();
    expect(notBlank(new FormControl('0'))).toBeNull();
  });

  it('should return error for empty string', () => {
    expect(notBlank(new FormControl(''))).toEqual({ notBlank: true });
  });

  it('should return error for whitespace-only strings', () => {
    expect(notBlank(new FormControl(' '))).toEqual({ notBlank: true });
    expect(notBlank(new FormControl('   '))).toEqual({ notBlank: true });
    expect(notBlank(new FormControl('\t'))).toEqual({ notBlank: true });
    expect(notBlank(new FormControl('\n'))).toEqual({ notBlank: true });
    expect(notBlank(new FormControl('\r\n'))).toEqual({ notBlank: true });
    expect(notBlank(new FormControl('  \t\n  '))).toEqual({ notBlank: true });
  });
});
