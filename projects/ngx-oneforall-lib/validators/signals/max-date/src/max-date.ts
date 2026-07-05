import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { maxDate as originalMaxDate } from 'ngx-oneforall/validators/max-date';

export type MaxDateFailureReason =
  | 'date_exceeds_max'
  | 'invalid_date'
  | 'unsupported_type';

/**
 * Signal Form validator that checks if the control's value is before or equal to a maximum date.
 *
 * @param path The path of the field in the form schema.
 * @param max The maximum allowed date (Date object, date string, or numeric timestamp).
 * @param options Optional configuration for the validation.
 * @param options.message Custom error message. Can be a string or a Record mapping failure reasons.
 */
export function maxDate(
  path: SchemaPath<Date | string | number | null | undefined>,
  max: Date | string | number,
  options?: { message?: string | Partial<Record<MaxDateFailureReason, string>> }
): void {
  const validator = originalMaxDate(max);

  validate(path, ({ value }) => {
    const error = validator({ value: value() } as AbstractControl);

    if (error) {
      let reason: MaxDateFailureReason;
      if (error['maxDate']) {
        reason = error['maxDate'].reason;
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
        kind: 'maxDate',
        message: msg,
      };
    }

    return null;
  });
}
