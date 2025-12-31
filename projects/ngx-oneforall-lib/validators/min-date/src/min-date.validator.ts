import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { date } from 'ngx-oneforall/validators/date';

/**
 * Validator that requires the control's value to be greater than or equal to a minimum date.
 *
 * @param min - The minimum allowed date (Date object, date string, or numeric timestamp).
 * @returns An error object with reason if validation fails, or `null` if valid.
 * @throws Error if the provided `min` date is invalid.
 */
export function minDate(min: Date | string | number): ValidatorFn {
  const minDateObj = min instanceof Date ? min : new Date(min);

  if (isNaN(minDateObj.getTime())) {
    throw new Error('minDate: invalid date provided as minimum.');
  }

  return (control: AbstractControl): ValidationErrors | null => {
    if (Validators.required(control)) return null;

    const dateError = date(control);
    if (dateError) return dateError;

    const value =
      control.value instanceof Date ? control.value : new Date(control.value);

    return value < minDateObj
      ? {
          minDate: {
            reason: 'date_before_min',
            requiredDate: minDateObj,
            actualValue: value,
          },
        }
      : null;
  };
}
