import {
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
import { DEFAULT_DATE_SEPARATORS } from './datetime-input.config';
import {
  parseFormat,
  ParsedToken,
  isValidPartialInput,
  getExpectedLength,
  getRawExpectedLength,
  extractDatePart,
  extractDatePartFromRaw,
  isValidDay,
} from './datetime-input.utils';

/**
 * Internal state for processing input.
 */
interface InputState {
  formatted: string;
  raw: string;
  tokenIndex: number;
  tokenCharIndex: number;
}

@Directive({
  selector: 'input[dateTimeInput]',
  exportAs: 'dateTimeInput',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
    '(keydown.backspace)': 'onBackspace($event)',
    '(focus)': 'onFocus($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeInputDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateTimeInputDirective),
      multi: true,
    },
  ],
})
export class DateTimeInputDirective implements ControlValueAccessor, Validator {
  /** The date/time format pattern (e.g., 'MM-DD-YYYY', 'HH:mm:ss') */
  format = input.required<string>({ alias: 'dateTimeInput' });

  /** Minimum allowed date */
  min = input<Date>();

  /** Maximum allowed date */
  max = input<Date>();

  /** Whether to clear input on blur if incomplete */
  clearIfNotMatch = input(false);

  /** Whether to remove separators from the form control value (default: true) */
  removeSpecialCharacters = input(true);

  private parsedTokens: ParsedToken[] = [];

  private readonly el = inject(ElementRef<HTMLInputElement>);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const format = this.format();
      untracked(() => {
        this.parsedTokens = parseFormat(format);
      });
    });
  }

  writeValue(value: string): void {
    const input = this.el.nativeElement;
    if (!value) {
      input.value = '';
      return;
    }

    // Ensure tokens are parsed if not already (handling initial writeValue timing)
    if (this.parsedTokens.length === 0) {
      const fmt = this.format();
      // This is synchronous
      untracked(() => {
        this.parsedTokens = parseFormat(fmt);
      });
    }

    const { formatted } = this.applyFormat(value);
    input.value = formatted;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  // Validator implementation
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const format = this.format();
    const isRaw = this.removeSpecialCharacters();
    const expectedLength = isRaw
      ? getRawExpectedLength(format)
      : getExpectedLength(format);

    // Check if input is complete
    if (value.length < expectedLength) {
      return {
        dateTimeInput: {
          requiredFormat: format,
          actualLength: value.length,
          expectedLength,
        },
      };
    }

    // Validate date parts are logical (e.g., day within month range)
    const extractFn = isRaw ? extractDatePartFromRaw : extractDatePart;
    const year = extractFn(value, format, 'year');
    const month = extractFn(value, format, 'month');
    const day = extractFn(value, format, 'day');

    if (year !== undefined && month !== undefined && day !== undefined) {
      if (!isValidDay(day, month, year)) {
        return {
          dateTimeInput: {
            message: `Invalid date: ${month}/${day}/${year} does not exist`,
            invalidDate: true,
          },
        };
      }
    }

    // Min/Max validation
    const min = this.min();
    const max = this.max();
    if (
      (min || max) &&
      year !== undefined &&
      month !== undefined &&
      day !== undefined
    ) {
      const inputDate = new Date(year, month - 1, day);
      if (min && inputDate < min) {
        return {
          dateTimeInput: {
            message: `Date must be on or after ${min.toLocaleDateString()}`,
            min: true,
          },
        };
      }
      if (max && inputDate > max) {
        return {
          dateTimeInput: {
            message: `Date must be on or before ${max.toLocaleDateString()}`,
            max: true,
          },
        };
      }
    }

    return null;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedCursorPos = input.selectionStart || 0;

    // Convert cursor position from formatted space to raw space
    // by counting how many non-pattern characters are before the cursor
    let rawCursorPos = 0;
    for (let i = 0; i < formattedCursorPos && i < input.value.length; i++) {
      if (!DEFAULT_DATE_SEPARATORS.includes(input.value[i])) {
        rawCursorPos++;
      }
    }

    const rawInput = this.extractRawInput(input.value);
    const { formatted, raw, newCursorPosition } = this.applyFormat(
      rawInput,
      rawCursorPos
    );

    input.value = formatted;
    const valueToEmit = this.removeSpecialCharacters() ? raw : formatted;
    this.onChange(valueToEmit);

    setTimeout(() => {
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  }

  onBackspace(e: Event): void {
    const input = e.target as HTMLInputElement;
    const cursorPos = input.selectionStart || 0;
    const isAtEnd = cursorPos === input.value.length;

    // If cursor is after a separator
    if (cursorPos > 0) {
      const charBefore = input.value[cursorPos - 1];
      if (DEFAULT_DATE_SEPARATORS.includes(charBefore)) {
        e.preventDefault();

        // Find position before all consecutive separators
        let newPos = cursorPos - 1;
        while (
          newPos > 0 &&
          DEFAULT_DATE_SEPARATORS.includes(input.value[newPos - 1])
        ) {
          newPos--;
        }

        if (isAtEnd && newPos > 0) {
          // At end of input: delete the separator and the digit before it
          const rawInput = this.extractRawInput(
            input.value.slice(0, newPos - 1)
          );
          const { formatted, raw } = this.applyFormat(
            rawInput,
            rawInput.length
          );
          input.value = formatted;
          const valueToEmit = this.removeSpecialCharacters() ? raw : formatted;
          this.onChange(valueToEmit);
          requestAnimationFrame(() => {
            input.setSelectionRange(formatted.length, formatted.length);
          });
        } else {
          // Not at end: just move cursor back
          requestAnimationFrame(() => {
            input.setSelectionRange(newPos, newPos);
          });
        }
      }
    }
  }

  onFocus(e: Event): void {
    const input = e.target as HTMLInputElement;
    // Place cursor at end if empty
    if (!input.value) {
      requestAnimationFrame(() => {
        input.setSelectionRange(0, 0);
      });
    }
  }

  onBlur(): void {
    this.onTouched();

    if (this.clearIfNotMatch()) {
      const input = this.el.nativeElement;
      const format = this.format();
      const expectedLength = getExpectedLength(format);

      if (input.value.length < expectedLength) {
        input.value = '';
        this.onChange('');
      }
    }
  }

  /**
   * Extract raw input by removing separators.
   */
  private extractRawInput(value: string): string {
    let raw = '';
    for (const char of value) {
      if (!DEFAULT_DATE_SEPARATORS.includes(char)) {
        raw += char;
      }
    }
    return raw;
  }

  /**
   * Apply the format to raw input, validating each character.
   * Tracks cursor position by mapping input index to output index.
   */
  private applyFormat(
    rawInput: string,
    cursorPosition = 0
  ): { formatted: string; raw: string; newCursorPosition: number } {
    const state: InputState = {
      formatted: '',
      raw: '',
      tokenIndex: 0,
      tokenCharIndex: 0,
    };

    let inputIndex = 0;
    let newCursorPosition = 0;
    let cursorSet = false;

    while (
      inputIndex < rawInput.length &&
      state.tokenIndex < this.parsedTokens.length
    ) {
      // Track cursor position: when we reach the input position where cursor was,
      // record the current output position
      if (inputIndex === cursorPosition && !cursorSet) {
        newCursorPosition = state.formatted.length;
        cursorSet = true;
      }

      const token = this.parsedTokens[state.tokenIndex];
      const inputChar = rawInput[inputIndex];

      if (token.isToken) {
        // Build test value for validation (includes existing characters + new one)
        const fullTokenValue = this.getTokenValueFromFormatted(
          state.formatted,
          state.tokenIndex
        );
        const testValue = fullTokenValue + inputChar;

        if (isValidPartialInput(testValue, token.value)) {
          state.formatted += inputChar;
          state.raw += inputChar;
          state.tokenCharIndex++;
          inputIndex++;

          // Check if current token (eg. hh, dd, mm) is complete
          if (
            state.tokenCharIndex >= (token.config?.length || token.value.length)
          ) {
            state.tokenIndex++;
            state.tokenCharIndex = 0;

            // Auto-insert next separator(s)
            while (
              state.tokenIndex < this.parsedTokens.length &&
              !this.parsedTokens[state.tokenIndex].isToken
            ) {
              state.formatted += this.parsedTokens[state.tokenIndex].value;
              state.tokenIndex++;
            }
          }
        } else {
          // Invalid character for this token - skip it
          inputIndex++;
        }
      } else {
        // Separator - skip in input, add to output
        state.formatted += token.value;
        state.tokenIndex++;
      }
    }

    // If cursor was at or beyond the end of input, place it at end of formatted output
    if (!cursorSet) {
      newCursorPosition = state.formatted.length;
    }

    return {
      formatted: state.formatted,
      raw: state.raw,
      newCursorPosition,
    };
  }

  /**
   * Get the current value of a token from the formatted string.
   */
  private getTokenValueFromFormatted(
    formatted: string,
    upToTokenIndex: number
  ): string {
    let position = 0;
    let result = '';

    for (let i = 0; i < upToTokenIndex && i < this.parsedTokens.length; i++) {
      const token = this.parsedTokens[i];
      const length = token.isToken
        ? token.config?.length || token.value.length
        : 1;
      position += length;
    }

    // Get current token's value from formatted string
    const currentToken = this.parsedTokens[upToTokenIndex];
    if (currentToken && currentToken.isToken) {
      const length = currentToken.config?.length || currentToken.value.length;
      result = formatted.slice(position, position + length);
    }

    return result;
  }
}
