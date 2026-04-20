import { Pipe, PipeTransform } from '@angular/core';
import { applyMask, MaskConfig } from 'ngx-oneforall/directives/mask';

/**
 * Pipe that applies a mask pattern to format a raw string value.
 *
 * Uses the same masking engine as the `MaskDirective`, supporting
 * all built-in patterns (`#`, `A`, `@`, `U`, `L`), quantifiers (`?`, `*`),
 * prefix/suffix, custom patterns, and special character handling.
 *
 * @usageNotes
 * ```html
 * <!-- Phone number -->
 * {{ '1234567890' | mask: '(###) ###-####' }}
 * <!-- Output: (123) 456-7890 -->
 *
 * <!-- Date -->
 * {{ '25122024' | mask: '##/##/####' }}
 * <!-- Output: 25/12/2024 -->
 *
 * <!-- With prefix -->
 * {{ '1234567890' | mask: '(###) ###-####' : { prefix: '+1 ' } }}
 * <!-- Output: +1 (123) 456-7890 -->
 *
 * <!-- Keep special characters in raw output -->
 * {{ '1234567890' | mask: '(###) ###-####' : { removeSpecialCharacters: false } }}
 * <!-- Output: (123) 456-7890 -->
 * ```
 */
@Pipe({
  name: 'mask',
})
export class MaskPipe implements PipeTransform {
  /**
   * Applies a mask pattern to the input value.
   *
   * @param value - The raw string to mask
   * @param mask - The mask pattern (e.g., '###-###-####')
   * @param config - Optional configuration for prefix, suffix, custom patterns, etc.
   * @returns The masked (formatted) string
   */
  transform(
    value: string | number | null | undefined,
    mask: string,
    config?: MaskConfig
  ): string {
    if (value == null || value === '') return '';

    const stringValue = String(value);
    return applyMask(stringValue, mask, config).masked;
  }
}
