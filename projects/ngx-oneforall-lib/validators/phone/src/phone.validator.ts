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
import { isPresent } from '@ngx-oneforall/utils/is-present';

export type CountryCode = CountryCodeType;

export const phoneValidator = (country: CountryCode): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (isPresent(Validators.required(control))) return null;

    const phone = control.value?.toString().trim();
    if (!phone) return null;

    return isValidPhoneNumber(phone, country as any) ? null : { phone: true };
  };
};
