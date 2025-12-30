import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isNumberString, isNumberValue } from 'ngx-oneforall/utils/is-number';
import { isPresent } from 'ngx-oneforall/utils/is-present';

/**
 * Validator that checks if the control's value is within a specified numeric range (inclusive).
 * It accepts numeric values and numeric strings that can be coerced to numbers.
 *
 * @param min - The minimum allowed value (inclusive).
 * @param max - The maximum allowed value (inclusive).
 * @returns A validator function that returns `{ range: { min, max, actualValue } }` if invalid, or `null` if valid.
 * @throws Error if `min` is greater than `max`.
 */
export function range(min: number, max: number): ValidatorFn {
  if (min > max) {
    throw new Error('[RangeValidator] min must be less than or equal to max');
  }

  return (control: AbstractControl): ValidationErrors | null => {
    if (!isPresent(control.value)) return null;

    const value = control.value;
    if (!isNumberValue(value) && !isNumberString(value)) return null;

    const numberValue = +control.value;

    return numberValue >= min && numberValue <= max
      ? null
      : {
          range: {
            reason: 'out_of_range',
            min,
            max,
            actualValue: numberValue,
          },
        };
  };
}
