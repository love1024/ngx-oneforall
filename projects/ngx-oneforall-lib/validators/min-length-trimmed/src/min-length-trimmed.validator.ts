import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isPresent } from 'ngx-oneforall/utils/is-present';

/**
 * Validator that checks if the trimmed control value meets a minimum length requirement.
 * Unlike Angular's built-in `Validators.minLength`, this validator trims whitespace
 * before calculating the length.
 *
 * @param minLength - The minimum length the trimmed value must have.
 * @returns A validator function that returns an error object if invalid, or `null` if valid.
 *
 * @example
 * ```typescript
 * import { FormControl } from '@angular/forms';
 * import { minLengthTrimmed } from 'ngx-oneforall/validators/min-length-trimmed';
 *
 * const control = new FormControl('', minLengthTrimmed(3));
 * control.setValue('ab'); // invalid - only 2 characters
 * control.setValue('  ab  '); // invalid - trimmed length is 2
 * control.setValue('abc'); // valid - 3 characters
 * ```
 *
 * @remarks
 * - Returns `null` if the value is `null`, `undefined`, or not a string.
 * - The error object includes `requiredLength` and `actualLength` for display purposes.
 */
export function minLengthTrimmed(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!isPresent(value) || typeof value !== 'string') {
      return null;
    }

    const trimmedLength = value.trim().length;

    if (trimmedLength < minLength) {
      return {
        minLengthTrimmed: {
          requiredLength: minLength,
          actualLength: trimmedLength,
        },
      };
    }

    return null;
  };
}
