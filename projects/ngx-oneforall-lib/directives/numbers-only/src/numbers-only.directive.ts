import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

@Directive({
  selector: '[numbersOnly]',
  host: {
    '(input)': 'onInputChanges()',
    '(paste)': 'onInputChanges()',
  },
})
export class NumbersOnlyDirective implements OnInit {
  decimals = input(0, { transform: numberAttribute });
  negative = input<boolean>(false);
  separator = input<string>('.');

  private oldValue = signal('');
  private readonly hostEl = inject(ElementRef);
  private readonly ngControl = inject(NgControl, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // This is needed first time if the control is not ngcontrol
    this.onInputChanges();

    // We need to get updates for an ngcontrol
    this.ngControl?.valueChanges
      ?.pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(newValue => {
        this.sanitizeAndUpdate(this.oldValue(), newValue);
      });
  }

  onInputChanges() {
    const newValue = this.hostEl.nativeElement.value;
    this.sanitizeAndUpdate(this.oldValue(), newValue);
  }

  private sanitizeAndUpdate(oldValue: string, newValue: string) {
    if (!newValue || (newValue === '-' && this.negative())) {
      this.oldValue.set(newValue);
      return;
    }
    const isValid =
      this.decimals() <= 0
        ? this.isValidInteger(newValue, this.negative())
        : this.isValidNumber(newValue, this.negative());
    if (!isValid) {
      // Replace new value with old, as it is not valid
      this.hostEl.nativeElement.value = oldValue;
    } else {
      this.oldValue.set(newValue);
    }
  }

  private isValidInteger(value: string, isNegative: boolean) {
    const regExpString = `^${isNegative ? '-?' : ''}\\d+$`;
    return new RegExp(regExpString).exec(String(value));
  }

  private isValidNumber(value: string, isNegative: boolean) {
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
