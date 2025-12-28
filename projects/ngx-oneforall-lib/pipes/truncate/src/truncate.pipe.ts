import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  pure: true,
})
export class TruncatePipe implements PipeTransform {
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
        truncated = truncated.slice(0, lastSpace);
      } else {
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
