import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates a string to a specified length with an optional ellipsis.
 * Supports complete word truncation and position-based truncation.
 *
 * @usageNotes
 * ```html
 * {{ text | truncate:50 }}                         → "Lorem ipsum dolor..."
 * {{ text | truncate:50:true }}                    → "Lorem ipsum..." (complete words)
 * {{ text | truncate:50:false:'...':'middle' }}    → "Lorem...world"
 * {{ text | truncate:50:false:'...':'start' }}     → "...dolor sit amet"
 * ```
 */
@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  /**
   * Truncates a string to the specified limit.
   *
   * @param value - The string to truncate
   * @param limit - Maximum character length (default: 100)
   * @param completeWords - If true, truncate at word boundary (default: false)
   * @param ellipsis - String to append when truncated (default: '…')
   * @param position - Where to truncate: 'end', 'start', or 'middle' (default: 'end')
   * @returns The truncated string with ellipsis
   */
  transform(
    value: string | null | undefined,
    limit = 100,
    completeWords = false,
    ellipsis = '…',
    position: 'start' | 'middle' | 'end' = 'end'
  ): string {
    if (!value) return '';
    if (limit <= 0) return '';
    if (value.length <= limit) return value;

    switch (position) {
      case 'start':
        return this.truncateStart(value, limit, ellipsis);
      case 'middle':
        return this.truncateMiddle(value, limit, ellipsis);
      case 'end':
      default:
        return this.truncateEnd(value, limit, completeWords, ellipsis);
    }
  }

  private truncateEnd(
    value: string,
    limit: number,
    completeWords: boolean,
    ellipsis: string
  ): string {
    let truncated = value.slice(0, limit);

    if (completeWords) {
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 0) {
        truncated = truncated.slice(0, lastSpace);
      } else {
        truncated = '';
      }
    }

    if (!truncated) {
      return ellipsis;
    }

    return truncated + ellipsis;
  }

  private truncateStart(
    value: string,
    limit: number,
    ellipsis: string
  ): string {
    const start = value.length - limit;
    return ellipsis + value.slice(start);
  }

  private truncateMiddle(
    value: string,
    limit: number,
    ellipsis: string
  ): string {
    const ellipsisLength = ellipsis.length;
    const charsToShow = limit - ellipsisLength;

    if (charsToShow <= 0) {
      return ellipsis;
    }

    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return value.slice(0, frontChars) + ellipsis + value.slice(-backChars);
  }
}
