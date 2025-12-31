import { Directive, effect, forwardRef, input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { BaseValidator } from 'ngx-oneforall/validators/base';
import { url, UrlValidatorOptions } from './url.validator';

@Directive({
  selector: '[url][formControlName],[url][formControl],[url][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UrlValidator),
      multi: true,
    },
  ],
})
export class UrlValidator extends BaseValidator {
  /**
   * Usage:
   * [url] // default strict validation
   * [url]="{ protocols: ['https'] }"
   */
  urlOptions = input<UrlValidatorOptions | null>(null, { alias: 'url' });

  constructor() {
    super();
    effect(() => {
      const options = this.urlOptions();
      this.validator = url(options || {});

      this.onChange?.();
    });
  }
}
