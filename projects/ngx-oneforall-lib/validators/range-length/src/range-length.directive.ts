import { Directive, effect, forwardRef, input, Signal } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { rangeLength } from './range-length.validator';
import { isPresent } from '@ngx-oneforall/utils';
import { BaseValidator } from '../../base/base.validator';

@Directive({
  selector:
    '[rangeLength][formControlName],[rangeLength][formControl],[rangeLength][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RangeLengthValidator),
      multi: true,
    },
  ],
})
export class RangeLengthValidator extends BaseValidator {
  /**
   * Usage:
   * [rangeLength]="[min, max]"
   */
  range = input<[number, number] | null>(null, { alias: 'rangeLength' });

  constructor() {
    super();
    effect(() => {
      const value = this.range();

      if (!isPresent(value)) {
        this.validator = null;
      } else {
        const [min, max] = value;
        this.validator = rangeLength(min, max);
      }

      this.onChange?.();
    });
  }
}
