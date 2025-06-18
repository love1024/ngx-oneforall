import { Directive, inject, input, numberAttribute } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numberOnly]',
})
export class NumbersOnlyDirective {
  decimals = input(0, { transform: numberAttribute });
  negative = input<boolean>(false);
  separator = input<string>(',');

  private ngControl = inject(NgControl);
}
