import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { range as originalRange } from 'ngx-oneforall/validators/range';

export type RangeFailureReason = 'out_of_range';

/**
 * Signal Form validator that checks if the control's value is within a specified numeric range.
 *
 * @param path The path of the field in the form schema.
 * @param min The minimum allowed value (inclusive).
 * @param max The maximum allowed value (inclusive).
 * @param options Optional configuration for the validation.
 * @param options.message Custom error message. Can be a string or a Record mapping failure reasons.
 */
export function range(
  path: SchemaPath<string | number | null | undefined>,
  min: number,
  max: number,
  options?: { message?: string | Partial<Record<RangeFailureReason, string>> }
): void {
  const validator = originalRange(min, max);

  validate(path, ({ value }) => {
    const error = validator({ value: value() } as AbstractControl);

    if (error && error['range']) {
      const details = error['range'];
      const reason = details.reason as RangeFailureReason;

      let msg: string = reason;
      if (typeof options?.message === 'string') {
        msg = options.message;
      } else if (options?.message && options.message[reason]) {
        msg = options.message[reason]!;
      }

      return {
        kind: 'range',
        message: msg,
      };
    }

    return null;
  });
}
