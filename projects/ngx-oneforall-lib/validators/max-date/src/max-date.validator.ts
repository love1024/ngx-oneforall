import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { date } from '../../date/src/date.validator';

/**
 * Validator that requires the control's value to be less than or equal to a maximum date.
 *
 * @param max - The maximum allowed date (Date object, date string, or numeric timestamp).
 * @returns An error object with reason if validation fails, or `null` if valid.
 * @throws Error if the provided `max` date is invalid.
 */
export function maxDate(max: Date | string | number): ValidatorFn {
  const maxDateObj = max instanceof Date ? max : new Date(max);

  if (isNaN(maxDateObj.getTime())) {
    throw new Error('maxDate: invalid date provided as maximum.');
  }

  return (control: AbstractControl): ValidationErrors | null => {
    if (Validators.required(control)) return null;

    const dateError = date(control);
    if (dateError) return dateError;

    const value =
      control.value instanceof Date ? control.value : new Date(control.value);

    return value > maxDateObj
      ? {
          maxDate: {
            reason: 'date_exceeds_max',
            requiredDate: maxDateObj,
            actualValue: value,
          },
        }
      : null;
  };
}
