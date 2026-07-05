import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { date as originalDate } from 'ngx-oneforall/validators/date';

export type DateFailureReason = 'invalid_date' | 'unsupported_type';

/**
 * Signal Form validator that checks if the control's value is a valid date.
 *
 * @param path The path of the field in the form schema.
 * @param options Optional configuration for the validation.
 * @param options.message Custom error message. Can be a string or a Record mapping failure reasons.
 */
export function date(
  path: SchemaPath<Date | string | number | null | undefined>,
  options?: { message?: string | Partial<Record<DateFailureReason, string>> }
): void {
  validate(path, ({ value }) => {
    const error = originalDate({ value: value() } as AbstractControl);

    if (error && error['date']) {
      const details = error['date'];
      const reason = details.reason as DateFailureReason;

      let msg: string = reason;
      if (typeof options?.message === 'string') {
        msg = options.message;
      } else if (options?.message && options.message[reason]) {
        msg = options.message[reason]!;
      }

      return {
        kind: 'date',
        message: msg,
      };
    }

    return null;
  });
}
