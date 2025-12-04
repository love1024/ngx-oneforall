import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralize',
})
export class PluralizePipe implements PipeTransform {

  transform(value: number | string, singular: string, plural?: string, includeNumber = true): string {
    const num = Number(value ?? 0);

    if (!singular) {
      throw new Error('pluralize pipe requires at least a singular form');
    }

    const singularForm = singular.trim();
    const pluralForm = plural ? plural.trim() : this.simplePluralize(singularForm);

    const chosen = num === 1 ? singularForm : pluralForm;

    return includeNumber ? `${num} ${chosen}` : chosen;
  }

  private simplePluralize(word: string): string {
    if (!word) return word;

    const lower = word.toLowerCase();

    // box -> boxes
    if (
      lower.endsWith('s') ||
      lower.endsWith('x') ||
      lower.endsWith('z') ||
      lower.endsWith('ch') ||
      lower.endsWith('sh')
    ) {
      return word + 'es';
    }

    // city → cities
    if (
      lower.endsWith('y') &&
      !'aeiou'.includes(lower[lower.length - 2])
    ) {
      return word.slice(0, -1) + 'ies';
    }

    return word + 's';
  }
}
