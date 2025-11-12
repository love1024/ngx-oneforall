import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  /**
   * Truncates a string to a given length and optionally adds an ellipsis.
   * @param value - The string to truncate.
   * @param limit - The maximum length (default: 100).
   * @param completeWords - Whether to truncate at whole words (default: false).
   * @param ellipsis - The string to append after truncation (default: '…').
   */
  transform(
    value: string | null | undefined,
    limit = 100,
    completeWords = false,
    ellipsis = '…'
  ): string {
    if (!value) return '';
    if (limit <= 0) return ellipsis;
    if (value.length <= limit) return value;

    let truncated = value.slice(0, limit);

    if (completeWords) {
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 0) {
        // cut at last whole word
        truncated = truncated.slice(0, lastSpace);
      } else {
        // no whole-word fit (space at index 0 or no spaces) -> nothing meaningful to show
        truncated = '';
      }
    }

    // If nothing remains after whole-word trimming, return only the ellipsis.
    if (!truncated) {
      return ellipsis;
    }

    return truncated + ellipsis;
  }
}
