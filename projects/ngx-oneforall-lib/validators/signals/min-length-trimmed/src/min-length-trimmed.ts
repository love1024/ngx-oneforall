import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { minLengthTrimmed as originalMinLengthTrimmed } from 'ngx-oneforall/validators/min-length-trimmed';

/**
 * Signal Form validator that checks if the trimmed control value meets a minimum length requirement.
 *
 * @param path The path of the field in the form schema.
 * @param minLength The minimum length the trimmed value must have.
 * @param options Optional configuration for the validation.
 * @param options.message Custom error message.
 */
export function minLengthTrimmed(
  path: SchemaPath<string | null | undefined>,
  minLength: number,
  options?: { message?: string }
): void {
  const validator = originalMinLengthTrimmed(minLength);

  validate(path, ({ value }) => {
    const error = validator({ value: value() } as AbstractControl);

    if (error && error['minLengthTrimmed']) {
      return {
        kind: 'minLengthTrimmed',
        message: options?.message || 'minLengthTrimmed',
      };
    }

    return null;
  });
}
