import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isNumberString, isNumberValue } from 'ngx-oneforall/utils/is-number';
import { isPresent } from 'ngx-oneforall/utils/is-present';

/**
 * Validator that checks if the control's value is a valid number.
 * It accepts numeric values and numeric strings.
 *
 * @param control - The control to validate.
 * @returns An error object `{ number: { actualValue } }` if validation fails, or `null` if valid.
 */
export const number: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (isPresent(Validators.required(control))) return null;

  const value = control.value;

  return isNumberValue(value) || isNumberString(value)
    ? null
    : { number: { actualValue: value } };
};
