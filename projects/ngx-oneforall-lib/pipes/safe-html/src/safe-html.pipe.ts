import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Bypasses Angular's HTML sanitization to render trusted HTML content.
 *
 * ⚠️ **Security Warning**: Only use with trusted content.
 * User input must be sanitized server-side before using this pipe.
 *
 * @usageNotes
 * ```html
 * <div [innerHTML]="htmlContent | safeHtml"></div>
 * ```
 */
@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Marks an HTML string as trusted.
   *
   * @param value - The HTML string to trust
   * @returns SafeHtml that can be bound to innerHTML
   * @throws Error if value is not a string
   */
  transform(value: unknown): SafeHtml {
    if (value === null || value === undefined) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }
    if (typeof value !== 'string') {
      throw new Error('SafeHtmlPipe: Value must be a string');
    }

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
