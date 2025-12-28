import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isPresent } from '@ngx-oneforall/utils/is-present';

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
    console.log(parsed);
    return isNaN(parsed.getTime()) ? { date: { actualValue: value } } : null;
  }

  return { date: { actualValue: value } };
};
