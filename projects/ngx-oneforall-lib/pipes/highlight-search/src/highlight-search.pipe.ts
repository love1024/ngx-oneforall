import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearch'
})
export class HighlightSearchPipe implements PipeTransform {
  transform(value: string | null | undefined, search: string | null | undefined): string {
    if (!value || !search) return value || '';

    const escaped = this.escapeRegex(search);
    const regex = new RegExp(escaped, 'gi');

    return value.replace(regex, (match) => `<mark>${match}</mark>`);
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
