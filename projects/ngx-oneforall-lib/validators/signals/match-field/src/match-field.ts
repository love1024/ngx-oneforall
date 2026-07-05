import { SchemaPath, validate } from '@angular/forms/signals';
import { isPresent } from 'ngx-oneforall/utils/is-present';

/**
 * Signal Form validator that checks if two child fields of a group have matching values.
 *
 * @param path The path of the parent object/group in the form schema.
 * @param field1 The property name of the first field.
 * @param field2 The property name of the second field.
 * @param options Optional configuration for the validation.
 */
export function matchFields<T extends Record<string, unknown>>(
  path: SchemaPath<T>,
  field1: Extract<keyof T, string>,
  field2: Extract<keyof T, string>,
  options?: { message?: string }
): void {
  validate(path, ({ value }) => {
    const groupValue = value();
    if (!groupValue) return null;

    const val1 = groupValue[field1];
    const val2 = groupValue[field2];

    if (!isPresent(val1) && !isPresent(val2)) {
      return null;
    }

    if (val1 !== val2) {
      return {
        kind: 'matchFields',
        message: options?.message || 'matchFields',
      };
    }

    return null;
  });
}
