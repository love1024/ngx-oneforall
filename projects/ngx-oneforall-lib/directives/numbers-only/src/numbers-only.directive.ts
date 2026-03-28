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
    '(cut)': 'onInputChanges()',
  },
})
export class NumbersOnlyDirective implements OnInit {
  /** Number of decimal places allowed (0 = integers only) */
  decimals = input(0, { transform: numberAttribute });
  /** Allow negative numbers */
  negative = input<boolean>(false);
  /** Decimal separator character */
  separator = input<string>('.');
  /** Enable thousand separators */
  enableThousandSeparator = input<boolean>(false);
  /** Thousand separator character */
  thousandSeparator = input<string>(',');

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
    const el = this.hostEl.nativeElement;
    const selectionStart = el.selectionStart;
    const newValue = el.value;
    this.sanitizeAndUpdate(this.oldValue(), newValue, selectionStart);
  }

  private sanitizeAndUpdate(
    oldValue: string,
    newValue: string,
    selectionStart?: number | null
  ) {
    if (!newValue || (newValue === '-' && this.negative())) {
      this.oldValue.set(newValue);
      return;
    }

    const tSep = this.thousandSeparator();
    const unformattedNewValue = this.enableThousandSeparator()
      ? newValue.split(tSep).join('')
      : newValue;

    const isValid =
      this.decimals() <= 0
        ? this.isValidInteger(unformattedNewValue, this.negative())
        : this.isValidNumber(unformattedNewValue, this.negative());

    if (!isValid) {
      // Replace new value with old, as it is not valid
      const expectedCursor =
        selectionStart !== undefined && selectionStart !== null
          ? Math.max(0, selectionStart - 1)
          : selectionStart;
      this.updateHostValueAndCursor(oldValue, expectedCursor);
    } else {
      let finalValue = newValue;
      if (this.enableThousandSeparator()) {
        finalValue = this.formatWithThousandSeparator(unformattedNewValue);
        if (newValue !== finalValue) {
          const newCursorPos = this.calculateCursorPosition(
            selectionStart,
            newValue,
            finalValue,
            tSep
          );
          this.updateHostValueAndCursor(finalValue, newCursorPos);
          this.syncNgControl(finalValue);
        }
      }
      this.oldValue.set(finalValue);
    }
  }

  private calculateCursorPosition(
    selectionStart: number | null | undefined,
    newValue: string,
    finalValue: string,
    tSep: string
  ): number | null | undefined {
    if (selectionStart === undefined || selectionStart === null) {
      return selectionStart;
    }
    const valueBeforeCursor = newValue.substring(0, selectionStart);
    const nonSepCount = valueBeforeCursor.split(tSep).join('').length;

    if (nonSepCount === 0) return 0;

    let count = 0;
    for (let i = 0; i < finalValue.length; i++) {
      if (finalValue[i] !== tSep) {
        count++;
      }
      if (count === nonSepCount) {
        return i + 1;
      }
    }
    return selectionStart;
  }

  private updateHostValueAndCursor(
    value: string,
    cursorPos: number | null | undefined
  ): void {
    this.hostEl.nativeElement.value = value;
    if (cursorPos !== undefined && cursorPos !== null) {
      this.hostEl.nativeElement.setSelectionRange(cursorPos, cursorPos);
    }
  }

  private syncNgControl(value: string): void {
    if (this.ngControl?.control && this.ngControl.control.value !== value) {
      this.ngControl.control.setValue(value, { emitEvent: false });
    }
  }

  private formatWithThousandSeparator(value: string): string {
    const dSep = this.separator();
    const tSep = this.thousandSeparator();
    const parts = value.split(dSep);
    let integerPart = parts[0];
    const decimalPart = parts[1];

    let prefix = '';
    if (integerPart.startsWith('-')) {
      prefix = '-';
      integerPart = integerPart.substring(1);
    }

    // Add thousand separators
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, tSep);

    let result = prefix + integerPart;
    if (decimalPart !== undefined) {
      result += dSep + decimalPart;
    }
    return result;
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
