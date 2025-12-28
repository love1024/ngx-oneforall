import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isNumberString, isNumberValue } from '@ngx-oneforall/utils/is-number';
import { isPresent } from '@ngx-oneforall/utils/is-present';

export const number: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (isPresent(Validators.required(control))) return null;

  const value = control.value;

  return isNumberValue(value) || isNumberString(value)
    ? null
    : { number: { actualValue: value } };
};
