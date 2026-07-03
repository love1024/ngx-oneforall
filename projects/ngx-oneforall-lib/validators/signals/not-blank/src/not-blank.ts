import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { notBlank as originalNotBlank } from 'ngx-oneforall/validators/not-blank';

/**
 * Signal Form validator that checks if the control's value is not blank (empty or whitespace-only).
 * Unlike standard required validators, this fails for strings that contain only
 * spaces, tabs, or newlines.
 *
 * @param path The path of the field in the form schema.
 * @param options Optional configuration for the validation.
 * @param options.message Custom error message for the validation.
 */
export function notBlank(
  path: SchemaPath<string | null | undefined>,
  options?: { message?: string }
): void {
  validate(path, ({ value }) => {
    const error = originalNotBlank({ value: value() } as AbstractControl);

    if (error) {
      return {
        kind: 'notBlank',
        message: options?.message || 'notBlank',
      };
    }

    return null;
  });
}
