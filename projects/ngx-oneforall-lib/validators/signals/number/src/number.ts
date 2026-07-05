import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { number as originalNumber } from 'ngx-oneforall/validators/number';

/**
 * Signal Form validator that checks if the control's value is a valid number.
 *
 * @param path The path of the field in the form schema.
 * @param options Optional configuration for the validation.
 * @param options.message Custom error message.
 */
export function number(
  path: SchemaPath<string | number | null | undefined>,
  options?: { message?: string }
): void {
  validate(path, ({ value }) => {
    const error = originalNumber({ value: value() } as AbstractControl);

    if (error && error['number']) {
      return {
        kind: 'number',
        message: options?.message || 'number',
      };
    }

    return null;
  });
}
