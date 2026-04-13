import {
  computed,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  numberAttribute,
  signal,
  untracked,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  ValidationErrors,
  Validator,
} from '@angular/forms';

/**
 * A directive to format numbers using native Intl.NumberFormat.
 * Formats on blur, shows raw value on focus for easy editing.
 */
@Directive({
  selector: '[numberInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NumberInputDirective,
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberInputDirective,
      multi: true,
    },
  ],
})
export class NumberInputDirective implements Validator, ControlValueAccessor {
  /** BCP 47 language tag */
  locale = input<string>(this.getBrowserLocale());

  /**
   * Intl.NumberFormatOptions.
   * See MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
   */
  options = input<Intl.NumberFormatOptions>();

  /** Minimum allowed value */
  min = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  });

  /** Maximum allowed value */
  max = input<number | undefined, unknown>(undefined, {
    transform: numberAttribute,
  });

  private readonly hostEl = inject(ElementRef<HTMLInputElement>);

  private readonly isFocused = signal(false);
  private readonly lastValidValue = signal<number | null>(null);

  private readonly formatterConfig = computed(() => {
    const loc = this.locale();
    const opts = this.options();
    try {
      const formatter = new Intl.NumberFormat(loc, opts);
      const parts = formatter.formatToParts(10000.1);
      const decPart = parts.find(p => p.type === 'decimal');
      const groupPart = parts.find(p => p.type === 'group');

      return {
        formatter,
        decimalSeparator: decPart ? decPart.value : '.',
        groupSeparator: groupPart ? groupPart.value : '',
      };
    } catch (e) {
      console.warn(
        'numberInput: Invalid Intl.NumberFormat configuration fallbacks to raw value.',
        e
      );
      // Fallback
      return {
        formatter: new Intl.NumberFormat('en-US'),
        decimalSeparator: '.',
        groupSeparator: ',',
      };
    }
  });

  private readonly formatter = computed(() => this.formatterConfig().formatter);
  private readonly decimalSeparator = computed(
    () => this.formatterConfig().decimalSeparator
  );
  private readonly groupSeparator = computed(
    () => this.formatterConfig().groupSeparator
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: number | string | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      // Establish reactive dependency
      this.formatterConfig();

      untracked(() => {
        // If not focused, seamlessly push format updates.
        // Assuming locale/options never mutate during active user focus session
        if (!this.isFocused()) {
          this.formatAndDisplay(
            this.lastValidValue() ?? this.hostEl.nativeElement.value
          );
        }
      });
    });
  }

  writeValue(val: unknown): void {
    if (this.isFocused()) {
      return;
    }
    this.formatAndDisplay(val);
  }

  registerOnChange(fn: (value: number | string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.hostEl.nativeElement.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (this.isEmpty(value)) {
      return null;
    }
    if (typeof value !== 'number' || isNaN(value)) {
      return { invalidNumber: true };
    }

    const min = this.min();
    if (min !== undefined && value < min) {
      return { min: { min, actual: value } };
    }

    const max = this.max();
    if (max !== undefined && value > max) {
      return { max: { max, actual: value } };
    }

    return null;
  }

  @HostListener('focus')
  onFocus(): void {
    this.isFocused.set(true);
    this.displayRawValue();
  }

  @HostListener('blur')
  onBlur(): void {
    this.isFocused.set(false);
    const parsed = this.parseInternalValue(this.hostEl.nativeElement.value);

    this.onChange(parsed);
    this.onTouched();
    this.formatAndDisplay(parsed);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const minVal = this.min();
    if (event.key === '-' && minVal !== undefined && minVal >= 0) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    let value = this.hostEl.nativeElement.value;

    // Restriction for pasting negative numbers if min >= 0
    const minVal = this.min();
    if (minVal !== undefined && minVal >= 0 && value.includes('-')) {
      value = value.replace(/-/g, '');
      this.hostEl.nativeElement.value = value;
    }

    if (this.isFocused()) {
      const parsed = this.parseInternalValue(value);
      this.onChange(parsed);
    }
  }

  private formatAndDisplay(val: unknown): void {
    if (this.isEmpty(val)) {
      this.hostEl.nativeElement.value = '';
      this.lastValidValue.set(null);
      return;
    }

    const num = typeof val === 'number' ? val : this.parseInternalValue(val);

    if (typeof num === 'number' && !isNaN(num)) {
      this.lastValidValue.set(num);
      this.hostEl.nativeElement.value = this.formatter().format(num);
    } else {
      this.lastValidValue.set(null);
      this.hostEl.nativeElement.value = typeof num === 'string' ? num : '';
    }
  }

  private parseInternalValue(val: unknown): number | string | null {
    if (this.isEmpty(val)) return null;

    let strVal = String(val).trim();
    if (strVal === '') return null;

    // Unformat grouping separators safely
    const groupSep = this.groupSeparator();
    if (groupSep) {
      const escapedGroup = this.escapeRegex(groupSep);
      const groupRegex = new RegExp(escapedGroup, 'g');
      strVal = strVal.replace(groupRegex, '');
    }

    // Normalize local decimal separator back to dot for JS Number
    let normalizedForParse = strVal;
    const decSep = this.decimalSeparator();
    if (decSep !== '.') {
      normalizedForParse = strVal.split(decSep).join('.');
    }

    const parsed = Number(normalizedForParse);
    return isNaN(parsed) ? strVal : parsed;
  }

  private displayRawValue(): void {
    const modelValue =
      this.lastValidValue() ??
      this.parseInternalValue(this.hostEl.nativeElement.value);

    if (this.isEmpty(modelValue)) {
      this.hostEl.nativeElement.value = '';
    } else {
      let rawString = String(modelValue);
      const decSep = this.decimalSeparator();
      rawString = rawString.replace('.', decSep);
      this.hostEl.nativeElement.value = rawString;
    }
  }

  private getBrowserLocale(): string {
    return navigator.language || 'en-US';
  }

  private isEmpty(val: unknown): boolean {
    return val === null || val === undefined || val === '';
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
