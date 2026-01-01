import { Directive, effect, forwardRef, input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { BaseValidator } from 'ngx-oneforall/validators/base';
import { matchFields } from './match-field.validator';

/**
 * Directive for template-driven forms to validate that two fields match.
 * Applied at the form level.
 *
 * @example
 * ```html
 * <form ngForm [matchFields]="['password', 'confirmPassword']">
 *   <input name="password" ngModel />
 *   <input name="confirmPassword" ngModel />
 * </form>
 * ```
 */
@Directive({
  selector: 'form[matchFields]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MatchFieldsValidator),
      multi: true,
    },
  ],
})
export class MatchFieldsValidator extends BaseValidator {
  /**
   * Array of two field names to compare
   */
  matchFieldsInput = input.required<[string, string]>({ alias: 'matchFields' });

  constructor() {
    super();
    effect(() => {
      const [field1, field2] = this.matchFieldsInput();
      this.validator = matchFields(field1, field2);

      this.onChange?.();
    });
  }
}
