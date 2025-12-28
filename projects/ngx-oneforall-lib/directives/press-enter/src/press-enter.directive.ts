import { Directive, input, output } from '@angular/core';

@Directive({
  selector: '[pressEnter]',
  host: {
    '(keydown.enter)': 'onEnter($event)',
  },
})
export class PressEnterDirective {
  /** Prevents default form submission behavior */
  preventDefault = input<boolean>(true);
  /** Emits when Enter key is pressed */
  pressEnter = output<void>();

  onEnter(event: Event): void {
    if (this.preventDefault()) {
      event.preventDefault();
    }
    this.pressEnter.emit();
  }
}
