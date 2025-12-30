import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  CountryCode as CountryCodeType,
  isValidPhoneNumber,
} from 'libphonenumber-js';
import { isPresent } from 'ngx-oneforall/utils/is-present';

export type CountryCode = CountryCodeType;

/**
 * Validator that checks if the control's value is a valid phone number for a specific country.
 * It uses `libphonenumber-js` for validation.
 *
 * @param country - The country code (e.g., 'US', 'GB') for which to validate the phone number.
 * @returns A validator function that returns `{ phone: true }` if invalid, or `null` if valid.
 */
export const phoneValidator = (country: CountryCode): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isPresent(Validators.required(control))) return null;

    const phone = control.value?.toString().trim();
    if (!phone) return null;

    return isValidPhoneNumber(phone, country)
      ? null
      : { phone: { reason: 'invalid_format', country } };
  };
};
