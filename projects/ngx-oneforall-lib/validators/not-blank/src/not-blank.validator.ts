import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isPresent } from 'ngx-oneforall/utils/is-present';

/**
 * Validator that checks if the control's value is not blank (empty or whitespace-only).
 * Unlike `Validators.required`, this validator fails for strings that contain only
 * spaces, tabs, or newlines.
 *
 * @returns A validator function that returns `{ notBlank: true }` if the value is blank,
 *   or `null` if the value is valid (non-blank).
 *
 * @example
 * ```typescript
 * import { FormControl, Validators } from '@angular/forms';
 * import { notBlank } from 'ngx-oneforall/validators/not-blank';
 *
 * // Use alone - allows null/undefined
 * const control = new FormControl(null, notBlank);
 * control.setValue('  '); // invalid - whitespace only
 * control.setValue('hello'); // valid
 *
 * // Combine with required for mandatory non-blank field
 * const requiredControl = new FormControl(null, [Validators.required, notBlank]);
 * ```
 *
 * @remarks
 * - Returns `null` if the value is `null` or `undefined`, to allow composition with `required`.
 * - Returns `null` for non-string values (numbers, objects, etc.), as they are not blank.
 * - Use in combination with `Validators.required` if the field should also be mandatory.
 */
export const notBlank: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;

  if (!isPresent(value) || typeof value !== 'string') {
    return null;
  }

  if (value.trim().length === 0) {
    return { notBlank: true };
  }

  return null;
};
