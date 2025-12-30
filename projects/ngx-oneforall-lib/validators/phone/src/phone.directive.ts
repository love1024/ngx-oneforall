import { Directive, effect, forwardRef, input, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { BaseValidator } from '../../base/base.validator';
import { CountryCode, phoneValidator } from './phone.validator';
import { isPresent } from 'ngx-oneforall/utils/is-present';

@Directive({
  selector: '[phone][formControlName],[phone][formControl],[phone][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneValidator),
      multi: true,
    },
  ],
})
export class PhoneValidator extends BaseValidator {
  phone = input<CountryCode | null>('US');

  constructor() {
    super();

    effect(() => {
      const phoneValue = this.phone();
      if (isPresent(phoneValue)) {
        this.validator = phoneValidator(phoneValue);
      } else {
        this.validator = null;
      }

      this.onChange?.();
    });
  }
}
