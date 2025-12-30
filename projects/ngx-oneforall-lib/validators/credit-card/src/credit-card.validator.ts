import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isPresent } from 'ngx-oneforall/utils/is-present';

/** Valid PAN lengths per ISO 7812 standard */
const VALID_PAN_LENGTHS = [13, 15, 16, 19] as const;

/**
 * Validator that checks if the control's value is a valid credit card number.
 * It uses the Luhn algorithm to verify the checksum and checks for standard PAN lengths.
 * It also validates that 15-digit cards are valid American Express cards (starting with 34 or 37).
 *
 * @param control - The control to validate.
 * @returns An error object with reason if validation fails, or `null` if valid.
 */
export const creditCard: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (isPresent(Validators.required(control))) return null;

  const digits = String(control.value).replace(/\D/g, '');

  // Reject repeated digits (0000..., 1111...)
  if (/^(\d)\1+$/.test(digits)) {
    return { creditCard: { reason: 'repeated_digits' } };
  }

  // Allowed PAN lengths (ISO 7812)
  if (!VALID_PAN_LENGTHS.includes(digits.length as 13 | 15 | 16 | 19)) {
    return {
      creditCard: { reason: 'invalid_length', actualLength: digits.length },
    };
  }

  // 15-digit cards must be Amex (34 or 37)
  if (digits.length === 15 && !/^3[47]/.test(digits)) {
    return { creditCard: { reason: 'invalid_amex_prefix' } };
  }

  // Luhn Algorithm
  let sum = 0;
  let double = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = +digits[i];
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }

  return sum % 10 === 0 ? null : { creditCard: { reason: 'luhn_failed' } };
};
