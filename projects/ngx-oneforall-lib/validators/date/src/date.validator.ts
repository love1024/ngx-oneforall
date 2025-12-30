import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isPresent } from '@ngx-oneforall/utils/is-present';
/**
 * Validator that checks if the control's value is a valid date.
 * It supports `Date` objects and date strings that can be parsed by `new Date()`.
 *
 * @param control - The control to validate.
 * @returns An error object `{ date: { actualValue } }` if validation fails, or `null` if valid.
 */
export const date: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (isPresent(Validators.required(control))) return null;

  const value = control.value;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? { date: { actualValue: value } } : null;
  }

  if (typeof value === 'string') {
    if (value.trim() === '') return null;

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? { date: { actualValue: value } } : null;
  }

  return { date: { actualValue: value } };
};
