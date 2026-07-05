import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { minDate as originalMinDate } from 'ngx-oneforall/validators/min-date';

export type MinDateFailureReason =
  | 'date_before_min'
  | 'invalid_date'
  | 'unsupported_type';

/**
 * Signal Form validator that checks if the control's value is on or after a minimum date.
 *
 * @param path The path of the field in the form schema.
 * @param min The minimum allowed date (Date object, date string, or numeric timestamp).
 * @param options Optional configuration for the validation.
 * @param options.message Custom error message. Can be a string or a Record mapping failure reasons.
 */
export function minDate(
  path: SchemaPath<Date | string | number | null | undefined>,
  min: Date | string | number,
  options?: { message?: string | Partial<Record<MinDateFailureReason, string>> }
): void {
  const validator = originalMinDate(min);

  validate(path, ({ value }) => {
    const error = validator({ value: value() } as AbstractControl);

    if (error) {
      let reason: MinDateFailureReason;
      if (error['minDate']) {
        reason = error['minDate'].reason;
      } else {
        reason = error['date'].reason;
      }

      let msg: string = reason;
      if (typeof options?.message === 'string') {
        msg = options.message;
      } else if (options?.message && options.message[reason]) {
        msg = options.message[reason]!;
      }

      return {
        kind: 'minDate',
        message: msg,
      };
    }

    return null;
  });
}
