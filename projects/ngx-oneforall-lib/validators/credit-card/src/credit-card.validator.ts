import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { isPresent } from '@ngx-oneforall/utils/is-present';

/**
 * Validator that checks if the control's value is a valid credit card number.
 * It uses the Luhn algorithm to verify the checksum and checks for standard PAN lengths.
 * It also validates that 15-digit cards are valid American Express cards (starting with 34 or 37).
 *
 * @param control - The control to validate.
 * @returns An error object `{ creditCard: true }` if validation fails, or `null` if valid.
 */
export const creditCard: ValidatorFn = (control: AbstractControl) => {
  if (isPresent(Validators.required(control))) return null;

  const digits = String(control.value).replace(/\D/g, '');

  // Reject repeated digits (0000..., 1111...)
  if (/^(\d)\1+$/.test(digits)) {
    return { creditCard: true };
  }

  // Allowed PAN lengths (ISO 7812)
  if (![13, 15, 16, 19].includes(digits.length)) {
    return { creditCard: true };
  }

  // 15-digit cards must be Amex (34 or 37)
  if (digits.length === 15 && !/^3[47]/.test(digits)) {
    return { creditCard: true };
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

  return sum % 10 === 0 ? null : { creditCard: true };
};
