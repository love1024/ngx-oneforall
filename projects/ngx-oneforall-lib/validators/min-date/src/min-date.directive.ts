import { Directive, effect, forwardRef, input } from '@angular/core';
import { BaseValidator } from 'ngx-oneforall/validators/base';
import { minDate } from './min-date.validator';
import { NG_VALIDATORS } from '@angular/forms';
import { isPresent } from 'ngx-oneforall/utils/is-present';

@Directive({
  selector:
    '[minDate][formControlName],[minDate][formControl],[minDate][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MinDateDirective),
      multi: true,
    },
  ],
})
export class MinDateDirective extends BaseValidator {
  minDate = input<string | Date | null>(null);

  constructor() {
    super();

    effect(() => {
      const minDateValue = this.minDate();
      if (isPresent(minDateValue)) {
        this.validator = minDate(minDateValue);
      } else {
        this.validator = null;
      }

      this.onChange?.();
    });
  }
}
