import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { BaseValidator } from 'ngx-oneforall/validators/base';
import { notBlank } from './not-blank.validator';

/**
 * Directive that validates a form control's value is not blank (empty or whitespace-only).
 *
 * @example
 * ```html
 * <input type="text" [(ngModel)]="name" notBlank>
 * ```
 */
@Directive({
  selector:
    '[notBlank][formControlName],[notBlank][formControl],[notBlank][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NotBlankValidator),
      multi: true,
    },
  ],
})
export class NotBlankValidator extends BaseValidator {
  constructor() {
    super();
    this.validator = notBlank;
  }
}
