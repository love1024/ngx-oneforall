import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isPresent } from 'ngx-oneforall/utils/is-present';

/**
 * Group-level validator that checks if two fields have matching values.
 * Applied to a FormGroup to validate that two child controls have the same value.
 *
 * @description
 * This validator is applied at the FormGroup level (not individual controls),
 * so it automatically re-validates when either field changes.
 *
 * @example
 * ```typescript
 * this.form = new FormGroup({
 *   password: new FormControl(''),
 *   confirmPassword: new FormControl('')
 * }, { validators: matchFields('password', 'confirmPassword') });
 * ```
 *
 * @param field1 - Name of the first control to compare
 * @param field2 - Name of the second control to compare
 * @returns A validator function that returns `{ matchFields: {...} }` on mismatch, or `null` if valid
 */
export function matchFields(field1: string, field2: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control1 = group.get(field1);
    const control2 = group.get(field2);

    if (!control1 || !control2) {
      return null;
    }

    const value1 = control1.value;
    const value2 = control2.value;

    // Skip if both are empty (let required handle that)
    if (!isPresent(value1) && !isPresent(value2)) {
      return null;
    }

    if (value1 !== value2) {
      return {
        matchFields: {
          field1,
          field1Value: value1,
          field2,
          field2Value: value2,
        },
      };
    }

    return null;
  };
}
