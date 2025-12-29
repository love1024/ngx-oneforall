import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pluralizes a word based on count.
 * Auto-generates plural form using English rules or uses a custom plural.
 *
 * @usageNotes
 * ```html
 * {{ count | pluralize:'item' }}              → "5 items"
 * {{ 1 | pluralize:'item' }}                  → "1 item"
 * {{ count | pluralize:'child':'children' }}  → "3 children"
 * {{ count | pluralize:'item':null:false }}   → "items" (without number)
 * ```
 */
@Pipe({
  name: 'pluralize',
})
export class PluralizePipe implements PipeTransform {
  /**
   * Transforms a count into a pluralized string.
   *
   * @param value - The count to base pluralization on
   * @param singular - The singular form of the word
   * @param plural - Optional custom plural form (auto-generated if not provided)
   * @param includeNumber - Whether to prefix the word with the count (default: true)
   * @returns The pluralized string, optionally prefixed with the count
   */
  transform(
    value: number | string,
    singular: string,
    plural?: string | null,
    includeNumber = true
  ): string {
    const num = Number(value ?? 0);

    if (!singular) {
      throw new Error('pluralize pipe requires at least a singular form');
    }

    const singularForm = singular.trim();
    const pluralForm = plural
      ? plural.trim()
      : this.simplePluralize(singularForm);

    const chosen = num === 1 ? singularForm : pluralForm;

    return includeNumber ? `${num} ${chosen}` : chosen;
  }

  private simplePluralize(word: string): string {
    if (!word || word.length === 0) return word;

    const lower = word.toLowerCase();

    // box → boxes, bus → buses, buzz → buzzes, church → churches, dish → dishes
    if (
      lower.endsWith('s') ||
      lower.endsWith('x') ||
      lower.endsWith('z') ||
      lower.endsWith('ch') ||
      lower.endsWith('sh')
    ) {
      return word + 'es';
    }

    // city → cities (consonant + y)
    if (lower.endsWith('y') && word.length > 1) {
      const secondLast = lower[lower.length - 2];
      if (!'aeiou'.includes(secondLast)) {
        return word.slice(0, -1) + 'ies';
      }
    }

    // Default: add 's'
    return word + 's';
  }
}
