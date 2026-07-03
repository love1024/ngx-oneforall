import { AbstractControl } from '@angular/forms';
import { SchemaPath, validate } from '@angular/forms/signals';
import { creditCard as originalCreditCard } from 'ngx-oneforall/validators/credit-card';

export type CreditCardFailureReason =
  | 'repeated_digits'
  | 'invalid_length'
  | 'invalid_amex_prefix'
  | 'luhn_failed';

export interface CreditCardSignalValidatorOptions {
  message?: string | Partial<Record<CreditCardFailureReason, string>>;
}

/**
 * Signal Form validator that checks if the field's value is a valid credit card number.
 * It uses the Luhn algorithm to verify the checksum and checks for standard PAN lengths.
 * It also validates that 15-digit cards are valid American Express cards (starting with 34 or 37).
 *
 * @param path - The path of the field in the form schema.
 * @param options - Optional configuration including a custom error message.
 */
export function creditCard(
  path: SchemaPath<string | number | null | undefined>,
  options?: CreditCardSignalValidatorOptions
): void {
  validate(path, ({ value }) => {
    const error = originalCreditCard({ value: value() } as AbstractControl);

    if (error && error['creditCard']) {
      const details = error['creditCard'];
      const reason = details.reason as CreditCardFailureReason;

      let msg: string = reason;
      if (typeof options?.message === 'string') {
        msg = options.message;
      } else if (options?.message && options.message[reason]) {
        msg = options.message[reason]!;
      }

      return {
        kind: 'creditCard',
        message: msg,
      };
    }

    return null;
  });
}
