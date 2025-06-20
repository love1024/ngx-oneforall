import {
  Directive,
  inject,
  input,
  numberAttribute,
  OnInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { distinctUntilChanged, pairwise } from 'rxjs';

@Directive({
  selector: '[numbersOnly]',
})
export class NumbersOnlyDirective implements OnInit {
  decimals = input(0, { transform: numberAttribute });
  negative = input<boolean>(false);
  separator = input<string>('.');

  private ngControl = inject(NgControl);

  ngOnInit() {
    this.ngControl.valueChanges
      ?.pipe(distinctUntilChanged(), pairwise())
      .subscribe(([oldValue, newValue]) => {
        this.sanitizeAndUpdate(oldValue, newValue);
      });
  }

  private sanitizeAndUpdate(oldValue: string, newValue: string) {
    if (!newValue || newValue === '-') {
      return;
    }
    const isValid =
      this.decimals() <= 0
        ? this.isValidInteger(newValue, this.negative())
        : this.isValidNumber(newValue, this.negative());
    if (!isValid) {
      this.ngControl.control?.setValue(oldValue);
    }
  }

  private isValidInteger(value: string, isNegative = false) {
    const regExpString = `^${isNegative ? '-?' : ''}\\d+$`;
    return new RegExp(regExpString).exec(String(value));
  }

  private isValidNumber(value: string, isNegative = false) {
    const regExpString =
      `^${isNegative ? '-?' : ''}\\s*((\\d+(\\` +
      this.separator() +
      '\\d{0,' +
      this.decimals() +
      '})?)|((\\d*(\\' +
      this.separator() +
      '\\d{1,' +
      this.decimals() +
      '}))))\\s*$';
    return new RegExp(regExpString).exec(String(value));
  }
}
