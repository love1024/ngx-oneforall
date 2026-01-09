import { Directive, input } from '@angular/core';

@Directive({
  selector: '[mask]',
  host: {
    '(input)': 'onInput($event)',
  },
})
export class MaskDirective {
  mask = input.required<string>();

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = this.maskValue(input.value);
  }

  private maskValue(value: string) {
    return value.replace(/[^0-9]/g, '');
  }
}
