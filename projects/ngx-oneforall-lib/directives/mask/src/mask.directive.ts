import { Directive, input } from '@angular/core';

@Directive({
  selector: '[mask]',
})
export class MaskDirective {
  mask = input.required<string>();
}
