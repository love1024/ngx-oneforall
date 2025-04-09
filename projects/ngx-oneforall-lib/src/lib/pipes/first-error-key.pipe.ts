import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * A custom Angular pipe that retrieves the first error key from an `AbstractControl` instance.
 * This is useful for displaying the first validation error in a form control.
 *
 * @example
 * <!-- Use directly with a form control -->
 *  <form>
 *     <input [formControl]="formControl" placeholder="Enter value" />
 *     @if (formControl | firstErrorKey as firstError) {
 *       <div>
 *          First error key: {{ firstError }}
 *        </div>
 *     }
 *  </form>
 *
 * @example
 * <!-- Use with validation errors -->
 *  <form>
 *     <input [formControl]="formControl" placeholder="Enter value" />
 *     <mat-error>
 *        {{ formControl.errors | firstErrorKey }}
 *     </mat-error>
 *  </form>
 *
 * @export
 * @class firstErrorKey
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'firstErrorKey',
})
export class FirstErrorKeyPipe implements PipeTransform {
  transform(input?: ValidationErrors | AbstractControl | null): string | null {
    if (!input) {
      return null;
    }

    const errors: ValidationErrors | null =
      input instanceof AbstractControl ? input.errors : input;
    if (!errors) {
      return null;
    }

    const errorKeys = Object.keys(errors);
    return errorKeys.length > 0 ? errorKeys[0] : null;
  }
}
