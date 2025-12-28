import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { date } from '../../date/src/date.validator';

export function maxDate(max: Date | string): ValidatorFn {
  const maxDateObj = typeof max === 'string' ? new Date(max) : max;

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
      ? { maxDate: { requiredDate: maxDateObj, actualValue: value } }
      : null;
  };
}
