import { FirstErrorKeyPipe } from './first-error-key.pipe';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';

describe('FirstErrorKeyPipe', () => {
  let pipe: FirstErrorKeyPipe;

  beforeEach(() => {
    pipe = new FirstErrorKeyPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string if input is null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return an empty string if input has no errors', () => {
    const mockControl = new FormControl('validValue', null);
    expect(pipe.transform(mockControl)).toBe('');
  });

  it('should return the first error key from a ValidationErrors object', () => {
    const errors: ValidationErrors = {
      required: true,
      minlength: { requiredLength: 5, actualLength: 3 },
    };
    expect(pipe.transform(errors)).toBe('required');
  });

  it('should return the first error key from an AbstractControl with errors', () => {
    const mockControl = new FormControl('abcdefghijklmnopqrstuv', [
      Validators.required,
      Validators.maxLength(10),
    ]);
    expect(pipe.transform(mockControl)).toBe('maxlength');
  });

  it('should return an empty string if AbstractControl has no errors', () => {
    const mockControl = new FormControl('validValue', null);
    expect(pipe.transform(mockControl)).toBe('');
  });

  it('should handle multiple error keys and return the first one', () => {
    const errors: ValidationErrors = {
      minlength: { requiredLength: 5, actualLength: 3 },
      required: true,
    };
    expect(pipe.transform(errors)).toBe('minlength');
  });

  it('should return an empty string if input is not a ValidationErrors object or AbstractControl', () => {
    expect(pipe.transform({})).toBe('');
  });
});
