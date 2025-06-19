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
  separator = input<string>(',');

  private ngControl = inject(NgControl);

  ngOnInit() {
    if (!this.ngControl) {
      throw new Error(
        'Control must be a NgControl to use NumbersOnlyDirective'
      );
    }
    this.ngControl.valueChanges
      ?.pipe(distinctUntilChanged(), pairwise())
      .subscribe(([oldValue, newvalue]) => {
        this.sanitizeAndUpdate(oldValue, newvalue);
      });
  }

  private sanitizeAndUpdate(oldValue: string, newValue: string) {
    if (this.negative()) {
      if (!['', '-'].includes(newValue) && !this.checkAllowNegative(newValue)) {
        this.ngControl.control?.setValue(oldValue);
      }
    } else {
      if (newValue !== '' && !this.check(newValue)) {
        this.ngControl.control?.setValue(oldValue);
      }
    }
  }

  private checkAllowNegative(value: string) {
    if (this.decimals() <= 0) {
      return new RegExp(/^-?\d+$/).exec(String(value));
    } else {
      const regExpString =
        '^-?\\s*((\\d+(\\' +
        this.separator +
        '\\d{0,' +
        this.decimals +
        '})?)|((\\d*(\\' +
        this.separator +
        '\\d{1,' +
        this.decimals +
        '}))))\\s*$';
      return new RegExp(regExpString).exec(String(value));
    }
  }

  private check(value: string) {
    if (this.decimals() <= 0) {
      return new RegExp(/^\d+$/).exec(String(value));
    } else {
      const regExpString =
        '^\\s*((\\d+(\\' +
        this.separator +
        '\\d{0,' +
        this.decimals +
        '})?)|((\\d*(\\' +
        this.separator +
        '\\d{1,' +
        this.decimals +
        '}))))\\s*$';
      return new RegExp(regExpString).exec(String(value));
    }
  }
}
