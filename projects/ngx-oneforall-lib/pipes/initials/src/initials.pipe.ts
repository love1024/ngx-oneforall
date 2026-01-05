import { Pipe, PipeTransform } from '@angular/core';

/**
 * Extracts the initials from a string (e.g., a name).
 *
 * @usageNotes
 * ```html
 * {{ 'John Doe' | initials }}      // Output: 'JO'
 * {{ 'John Doe' | initials:1 }}    // Output: 'J'
 * {{ 'John' | initials }}          // Output: 'J'
 * ```
 */
@Pipe({
  name: 'initials',
  standalone: true,
})
export class InitialsPipe implements PipeTransform {
  /**
   * Transforms the input string into initials.
   *
   * @param value - The input string (e.g., name)
   * @param count - The maximum number of initials to return (default: 2)
   * @returns The initials string
   */
  transform(value: string | null | undefined, count = 2): string {
    if (!value) {
      return '';
    }

    const words = value.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].slice(0, count).toUpperCase();
    }

    return words
      .slice(0, count)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }
}
