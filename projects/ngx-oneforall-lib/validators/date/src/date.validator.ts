import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isPresent } from '@ngx-oneforall/utils/is-present';

/**
 * Validator that checks if the control's value is a valid date.
 * It supports `Date` objects, date strings, and numeric timestamps.
 *
 * @param control - The control to validate.
 * @returns An error object with reason if validation fails, or `null` if valid.
 */
export const date: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (isPresent(Validators.required(control))) return null;

  const value = control.value;

  if (value instanceof Date) {
    return isNaN(value.getTime())
      ? { date: { reason: 'invalid_date', actualValue: value } }
      : null;
  }

  if (typeof value === 'string') {
    if (value.trim() === '') return null;

    const parsed = new Date(value);
    return isNaN(parsed.getTime())
      ? { date: { reason: 'invalid_date', actualValue: value } }
      : null;
  }

  return { date: { reason: 'unsupported_type', actualValue: value } };
};
