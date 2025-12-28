import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);
  transform(value: unknown): SafeHtml {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value !== 'string') {
      throw new Error('Value must be a string');
    }

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
