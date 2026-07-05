import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { rangeLength as originalRangeLength } from 'ngx-oneforall/validators/range-length';

export type RangeLengthFailureReason = 'length_out_of_range';

/**
 * Signal Form validator that checks if the length of the control's value is within a specified range (inclusive).
 *
 * @param path The path of the field in the form schema.
 * @param min The minimum allowed length (inclusive).
 * @param max The maximum allowed length (inclusive).
 * @param options Optional configuration for the validation.
 * @param options.message Custom error message. Can be a string or a Record mapping failure reasons.
 */
export function rangeLength(
  path: SchemaPath<string | unknown[] | null | undefined>,
  min: number,
  max: number,
  options?: {
    message?: string | Partial<Record<RangeLengthFailureReason, string>>;
  }
): void {
  const validator = originalRangeLength(min, max);

  validate(path, ({ value }) => {
    const error = validator({ value: value() } as AbstractControl);

    if (error && error['rangeLength']) {
      const details = error['rangeLength'];
      const reason = details.reason as RangeLengthFailureReason;

      let msg: string = reason;
      if (typeof options?.message === 'string') {
        msg = options.message;
      } else if (options?.message && options.message[reason]) {
        msg = options.message[reason]!;
      }

      return {
        kind: 'rangeLength',
        message: msg,
      };
    }

    return null;
  });
}
