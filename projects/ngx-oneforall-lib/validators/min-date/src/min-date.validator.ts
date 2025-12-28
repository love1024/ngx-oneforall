import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { date } from '../../date/src/date.validator';

export function minDate(min: Date | string): ValidatorFn {
  const minDateObj = typeof min === 'string' ? new Date(min) : min;

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
      ? { minDate: { requiredDate: minDateObj, actualValue: value } }
      : null;
  };
}
