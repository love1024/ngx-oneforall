import { Pipe, PipeTransform } from '@angular/core';

/**
 * Highlights matching search text by wrapping it in HTML tags.
 * Safe for use with innerHTML binding.
 *
 * @usageNotes
 * ```html
 * <!-- Basic usage with <mark> -->
 * <span [innerHTML]="text | highlightSearch:searchTerm"></span>
 *
 * <!-- Custom tag and class -->
 * <span [innerHTML]="text | highlightSearch:searchTerm:'span':'highlight'"></span>
 * ```
 */
@Pipe({
  name: 'highlightSearch',
})
export class HighlightSearchPipe implements PipeTransform {
  /**
   * Highlights matching text in a string.
   *
   * @param value - The text to search within
   * @param search - The search term to highlight
   * @param tag - HTML tag to wrap matches (default: 'mark')
   * @param cssClass - Optional CSS class for the wrapper element
   * @returns HTML string with matches wrapped in the specified tag
   */
  transform(
    value: string | null | undefined,
    search: string | null | undefined,
    tag = 'mark',
    cssClass?: string
  ): string {
    if (!value || !search) return value || '';

    const escaped = this.escapeRegex(search);
    const regex = new RegExp(escaped, 'gi');
    const classAttr = cssClass ? ` class="${cssClass}"` : '';

    return value.replace(
      regex,
      match => `<${tag}${classAttr}>${match}</${tag}>`
    );
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
