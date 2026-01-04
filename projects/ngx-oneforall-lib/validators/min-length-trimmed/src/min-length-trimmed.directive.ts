import {
  Directive,
  effect,
  forwardRef,
  input,
  numberAttribute,
} from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { BaseValidator } from 'ngx-oneforall/validators/base';
import { minLengthTrimmed } from './min-length-trimmed.validator';

/**
 * Directive that validates the trimmed minimum length of a form control's value.
 *
 * @example
 * ```html
 * <input type="text" [(ngModel)]="username" [minLengthTrimmed]="3">
 * ```
 */
@Directive({
  selector:
    '[minLengthTrimmed][formControlName],[minLengthTrimmed][formControl],[minLengthTrimmed][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MinLengthTrimmedValidator),
      multi: true,
    },
  ],
})
export class MinLengthTrimmedValidator extends BaseValidator {
  /**
   * The minimum length the trimmed value must have.
   */
  minLengthTrimmedValue = input.required<number, number | string>({
    alias: 'minLengthTrimmed',
    transform: numberAttribute,
  });

  constructor() {
    super();
    effect(() => {
      const length = this.minLengthTrimmedValue();
      this.validator = minLengthTrimmed(length);
      this.onChange?.();
    });
  }
}
