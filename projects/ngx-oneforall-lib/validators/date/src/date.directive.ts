import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { BaseValidator } from 'ngx-oneforall/validators/base';
import { date } from './date.validator';

@Directive({
  selector: '[date][formControlName],[date][formControl],[date][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateValidator),
      multi: true,
    },
  ],
})
export class DateValidator extends BaseValidator {
  constructor() {
    super();
    this.validator = date;
  }
}
