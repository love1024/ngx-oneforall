import {
  computed,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  effect,
  untracked,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {
  DEFAULT_SPECIAL_CHARACTERS,
  IConfigPattern,
  patterns,
} from './mask.config';
import { getExpectedLength, getRequiredEndPosition } from './mask.utils';
import { applyMask, MaskConfig, validateMask } from './mask.engine';

@Directive({
  selector: '[mask]',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
    '(click)': 'onFocus($event)',
    '(focus)': 'onFocus($event)',
    '(keyup)': 'onFocus($event)',
    '(keydown.backspace)': 'onBackspace($event)',
  },
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaskDirective),
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaskDirective),
      multi: true,
    },
  ],
})
export class MaskDirective implements Validator, ControlValueAccessor {
  mask = input.required<string>();

  prefix = input('');
  suffix = input('');
  specialCharacters = input<string[]>(DEFAULT_SPECIAL_CHARACTERS);
  mergeSpecialChars = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' || value === 'true' : value,
  });

  removeSpecialCharacters = input(true, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' || value === 'true' : value,
  });

  customPatterns = input<Record<string, IConfigPattern>>({});

  clearIfNotMatch = input(false);

  private elementRef = inject(ElementRef<HTMLInputElement>);

  private mergedPatterns = computed(() => ({
    ...patterns,
    ...this.customPatterns(),
  }));

  constructor() {
    effect(() => {
      const mask = this.mask();
      const prefix = this.prefix();
      const suffix = this.suffix();
      // Used for tracking purposes
      this.clearIfNotMatch();

      const config = this.buildConfig();
      validateMask(mask, config);

      untracked(() => {
        const currentValue = this.elementRef.nativeElement.value;
        const input = this.elementRef.nativeElement;
        if (currentValue) {
          const selectionStart = input.selectionStart ?? 0;
          this.applyAndSetMask(input, currentValue, mask, selectionStart);
        } else if (prefix || suffix) {
          // If configured prefix/suffix but value is empty, ensure it stays empty
          // because we don't want to show just prefix/suffix
          this.elementRef.nativeElement.value = '';
          this.onChange('');
        }
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      const { masked } = applyMask(value, this.mask(), this.buildConfig());
      this.elementRef.nativeElement.value = masked;
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const initialSelection = input.selectionStart ?? input.value.length;

    this.applyAndSetMask(input, input.value, this.mask(), initialSelection);
  }

  onBackspace(e: Event) {
    const el = e.target as HTMLInputElement;
    const prefix = this.prefix();

    const cursor = el.selectionStart ?? 0;

    // Check if we are trying to delete the prefix
    if (cursor <= prefix.length) {
      el.setSelectionRange(prefix.length, prefix.length);
      e.preventDefault();
      return;
    }

    // If cursor is just after a non pattern char, move it back without deleting the separator
    const charBefore = el.value[cursor - 1];
    const activePatterns = this.mergedPatterns();

    const isNonPatternChar =
      !activePatterns[charBefore] && !/\w/.test(charBefore);

    if (isNonPatternChar) {
      // Move cursor back by 1 to skip over the non pattern char
      el.setSelectionRange(cursor - 1, cursor - 1);
      e.preventDefault(); // Prevent default - just move cursor
    }
  }

  onFocus(e: Event) {
    const el = e.target as HTMLInputElement;
    const prefix = this.prefix();
    const suffix = this.suffix();

    if (!el.value) return;

    const selectionStart = el.selectionStart ?? 0;
    const selectionEnd = el.selectionEnd ?? 0;

    // Allow selecting text, but if it's a single cursor, enforce limits
    if (selectionStart !== selectionEnd) return;

    const newPos = this.constrainCursor(
      selectionStart,
      el.value.length,
      prefix.length,
      suffix.length
    );

    if (newPos !== selectionStart) {
      el.setSelectionRange(newPos, newPos);
    }
  }

  onBlur() {
    this.onTouched();

    if (this.clearIfNotMatch()) {
      const mask = this.mask();
      const { raw } = applyMask(
        this.elementRef.nativeElement.value,
        mask,
        this.buildConfig()
      );
      const expectedLength = getExpectedLength(mask, this.mergedPatterns());

      if (raw.length < expectedLength) {
        this.elementRef.nativeElement.value = '';
        this.onChange('');
      }
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const mask = this.mask();
    const activePatterns = this.mergedPatterns();
    const { raw, maskEndPosition } = applyMask(value, mask, this.buildConfig());
    const expectedLength = getExpectedLength(mask, activePatterns);
    const requiredEndPosition = getRequiredEndPosition(mask, activePatterns);

    // Check if mask position reached past all required patterns
    // This catches cases where optionals are filled but trailing required are not
    if (maskEndPosition < requiredEndPosition || raw.length < expectedLength) {
      return {
        mask: {
          requiredMask: mask,
          actualLength: raw.length,
          expectedLength: expectedLength,
        },
      };
    }

    return null;
  }

  private applyAndSetMask(
    input: HTMLInputElement,
    value: string,
    mask: string,
    selectionStart: number
  ): void {
    const { masked, raw, newCursorPosition } = applyMask(
      value,
      mask,
      this.buildConfig(),
      selectionStart
    );

    input.value = masked;
    this.onChange(raw);
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }

  private constrainCursor(
    position: number,
    totalLength: number,
    prefixLength: number,
    suffixLength: number
  ): number {
    if (position < prefixLength) {
      return prefixLength;
    }
    if (position > totalLength - suffixLength) {
      return totalLength - suffixLength;
    }
    return position;
  }

  private buildConfig(): MaskConfig {
    return {
      prefix: this.prefix(),
      suffix: this.suffix(),
      specialCharacters: this.specialCharacters(),
      mergeSpecialChars: this.mergeSpecialChars(),
      customPatterns: this.customPatterns(),
      removeSpecialCharacters: this.removeSpecialCharacters(),
    };
  }
}
