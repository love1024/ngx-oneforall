import { FirstErrorKeyPipe } from './first-error-key.pipe';
import { ValidationErrors } from '@angular/forms';

describe('FirstErrorKeyPipe', () => {
  let pipe: FirstErrorKeyPipe;

  beforeEach(() => {
    pipe = new FirstErrorKeyPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string if errors is null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string if errors is an empty object', () => {
    expect(pipe.transform({})).toBe('');
  });

  it('should return the first error key from a ValidationErrors object', () => {
    const errors: ValidationErrors = {
      required: true,
      minlength: { requiredLength: 5, actualLength: 3 },
    };
    expect(pipe.transform(errors)).toBe('required');
  });

  it('should handle multiple error keys and return the first one', () => {
    const errors: ValidationErrors = {
      minlength: { requiredLength: 5, actualLength: 3 },
      required: true,
    };
    expect(pipe.transform(errors)).toBe('minlength');
  });

  describe('Priority ordering', () => {
    it('should return first priority key that exists in errors', () => {
      const errors: ValidationErrors = {
        minlength: true,
        required: true,
        pattern: true,
      };
      expect(pipe.transform(errors, ['required', 'minlength'])).toBe(
        'required'
      );
    });

    it('should skip priority keys not in errors and return next matching', () => {
      const errors: ValidationErrors = {
        minlength: true,
        pattern: true,
      };
      expect(pipe.transform(errors, ['required', 'minlength', 'pattern'])).toBe(
        'minlength'
      );
    });

    it('should fall back to first error if no priority keys match', () => {
      const errors: ValidationErrors = {
        customError: true,
        anotherError: true,
      };
      expect(pipe.transform(errors, ['required', 'minlength'])).toBe(
        'customError'
      );
    });

    it('should work with empty priority array', () => {
      const errors: ValidationErrors = {
        required: true,
      };
      expect(pipe.transform(errors, [])).toBe('required');
    });
  });
});
