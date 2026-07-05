import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import {
  phoneValidator as originalPhoneValidator,
  CountryCode,
} from 'ngx-oneforall/validators/phone';

export type PhoneFailureReason = 'invalid_format';

/**
 * Signal Form validator that checks if the control's value is a valid phone number.
 *
 * @param path The path of the field in the form schema.
 * @param country The country code for phone validation (e.g., 'US').
 * @param options Optional configuration for the validation.
 * @param options.message Custom error message. Can be a string or a Record mapping failure reasons.
 */
export function phone(
  path: SchemaPath<string | null | undefined>,
  country: CountryCode,
  options?: { message?: string | Partial<Record<PhoneFailureReason, string>> }
): void {
  const validator = originalPhoneValidator(country);

  validate(path, ({ value }) => {
    const error = validator({ value: value() } as AbstractControl);

    if (error && error['phone']) {
      const details = error['phone'];
      const reason = details.reason as PhoneFailureReason;

      let msg: string = reason;
      if (typeof options?.message === 'string') {
        msg = options.message;
      } else if (options?.message && options.message[reason]) {
        msg = options.message[reason]!;
      }

      return {
        kind: 'phone',
        message: msg,
      };
    }

    return null;
  });
}
