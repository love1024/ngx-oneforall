import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

/**
 * Pipe that retrieves the first error key from a `ValidationErrors` object.
 * Supports optional priority ordering to control which error displays first.
 *
 * @usageNotes
 * ```html
 * <!-- Basic usage -->
 * @if (formControl.errors | firstErrorKey; as error) {
 *   <div class="error">{{ error }}</div>
 * }
 *
 * <!-- With priority ordering -->
 * {{ formControl.errors | firstErrorKey:['required', 'minlength', 'pattern'] }}
 * ```
 */
@Pipe({
  name: 'firstErrorKey',
})
export class FirstErrorKeyPipe implements PipeTransform {
  /**
   * Extracts the first error key from a ValidationErrors object.
   *
   * @param errors - ValidationErrors object from a form control
   * @param priority - Optional array of error keys in priority order
   * @returns The first error key (prioritized if specified), or empty string if no errors
   */
  transform(errors?: ValidationErrors | null, priority?: string[]): string {
    if (!errors) {
      return '';
    }

    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) {
      return '';
    }

    // If priority list provided, return first matching priority key
    if (priority && priority.length > 0) {
      for (const key of priority) {
        if (errorKeys.includes(key)) {
          return key;
        }
      }
    }

    // Fall back to first available key
    return errorKeys[0];
  }
}
