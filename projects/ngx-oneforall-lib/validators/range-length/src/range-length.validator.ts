import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isPresent } from 'ngx-oneforall/utils/is-present';

/**
 * Validator that checks if the length of the control's value is within a specified range (inclusive).
 * It supports strings, arrays, and numbers (converted to string).
 *
 * @param min - The minimum allowed length (inclusive).
 * @param max - The maximum allowed length (inclusive).
 * @returns A validator function that returns an error object with reason if invalid, or `null` if valid.
 * @throws Error if `min` is greater than `max`.
 */
export function rangeLength(min: number, max: number): ValidatorFn {
  if (min > max) {
    throw new Error(
      '[RangeLengthValidator] min must be less than or equal to max'
    );
  }

  return (control: AbstractControl): ValidationErrors | null => {
    if (isPresent(Validators.required(control))) return null;

    const value = control.value;

    let length: number | null = null;

    if (typeof value === 'string' || Array.isArray(value)) {
      length = value.length;
    } else if (typeof value === 'number') {
      length = value.toString().length;
    }

    if (length == null) return null;

    return length >= min && length <= max
      ? null
      : {
          rangeLength: {
            reason: 'length_out_of_range',
            requiredMinLength: min,
            requiredMaxLength: max,
            actualLength: length,
          },
        };
  };
}
