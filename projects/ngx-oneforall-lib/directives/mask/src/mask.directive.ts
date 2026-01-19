import {
  computed,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { IConfigPattern, MaskQuantifier, patterns } from './mask.config';
import {
  getExpectedLength,
  getRequiredEndPosition,
  isQuantifier,
  canSkipOptional,
} from './mask.utils';

interface MaskState {
  raw: string;
  masked: string;
  maskPosition: number;
  inputOffset: number;
}

@Directive({
  selector: '[mask]',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
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

  customPatterns = input<Record<string, IConfigPattern>>({});

  clearIfNotMatch = input(false);

  private elementRef = inject(ElementRef<HTMLInputElement>);

  private mergedPatterns = computed(() => ({
    ...patterns,
    ...this.customPatterns(),
  }));

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    if (value) {
      const { masked } = this.applyMask(value, this.mask());
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

    const { masked, raw, newCursorPosition } = this.applyMask(
      input.value,
      this.mask(),
      initialSelection
    );

    input.value = masked;
    this.onChange(raw);

    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }

  onBackspace(e: Event) {
    const el = e.target as HTMLInputElement;

    const cursor = el.selectionStart ?? 0;
    // If cursor is just after a non pattern char, move it back without deleting the separator
    if (cursor > 0) {
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
  }

  onBlur() {
    this.onTouched();

    if (this.clearIfNotMatch()) {
      const mask = this.mask();
      const { raw } = this.applyMask(this.elementRef.nativeElement.value, mask);
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
    const { raw, maskEndPosition } = this.applyMask(value, mask);
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

  private applyMask(
    inputValue: string,
    mask: string,
    cursorPosition = 0
  ): {
    masked: string;
    raw: string;
    maskEndPosition: number;
    newCursorPosition: number;
  } {
    const activePatterns = this.mergedPatterns();
    let raw = '';
    let masked = '';
    let maskPosition = 0;
    let newCursorPosition = 0;
    let cursorSet = false;

    for (let i = 0; i < inputValue.length && maskPosition < mask.length; i++) {
      // Track cursor position mapping
      if (i === cursorPosition) {
        newCursorPosition = masked.length;
        cursorSet = true;
      }

      const inputChar = inputValue[i];
      const maskChar = mask[maskPosition];
      const nextChar = mask[maskPosition + 1];
      const quantifier = isQuantifier(nextChar) ? nextChar : null;

      const pattern = activePatterns[maskChar];
      const state: MaskState = {
        raw,
        masked,
        maskPosition,
        inputOffset: 0,
      };

      if (pattern) {
        this.handlePatternChar(
          inputChar,
          pattern,
          quantifier,
          state,
          mask,
          activePatterns,
          inputValue,
          i
        );
      } else if (!isQuantifier(maskChar)) {
        this.handleNonPatternChars(inputChar, mask, activePatterns, state);
      }

      raw = state.raw;
      masked = state.masked;
      maskPosition = state.maskPosition;
      i += state.inputOffset;
    }

    // Handle cursor at the very end or if loop terminated early (mask full)
    if (!cursorSet && cursorPosition > 0) {
      newCursorPosition = masked.length;
    }

    return { masked, raw, maskEndPosition: maskPosition, newCursorPosition };
  }

  private handlePatternChar(
    inputChar: string,
    pattern: IConfigPattern,
    quantifier: MaskQuantifier | null,
    state: MaskState,
    mask: string,
    activePatterns: Record<string, IConfigPattern>,
    inputValue: string,
    inputIndex: number
  ): void {
    const matches = pattern.pattern.test(inputChar);
    const isOptional =
      pattern.optional ||
      quantifier === MaskQuantifier.Optional ||
      quantifier === MaskQuantifier.ZeroOrMore;

    if (matches) {
      state.raw += inputChar;
      state.masked += inputChar;

      // For * quantifier, stay on the same pattern (don't advance mask position)
      if (quantifier === MaskQuantifier.ZeroOrMore) {
        this.handleZeroOrMoreTransition(inputChar, state, mask, activePatterns);
        return;
      }

      // For ? quantifier as next, move one more step to pass it as well
      state.maskPosition += quantifier ? 2 : 1;
    } else if (isOptional) {
      const nextMaskPos = state.maskPosition + (quantifier ? 2 : 1);

      // Use the new robust utility to check if we can skip
      const { canSkip, skipToPos } = canSkipOptional(
        inputChar,
        mask,
        state.maskPosition,
        activePatterns,
        inputValue,
        inputIndex,
        nextMaskPos
      );

      if (canSkip) {
        state.maskPosition = skipToPos;
        state.inputOffset = -1; // Retry input against new position
      }
    }
  }

  private handleZeroOrMoreTransition(
    inputChar: string,
    state: MaskState,
    mask: string,
    activePatterns: Record<string, IConfigPattern>
  ): void {
    const nextMaskPos = state.maskPosition + 2;
    if (nextMaskPos < mask.length) {
      const nextChar = mask[nextMaskPos];
      const nextPattern = activePatterns[nextChar];

      // Non-greedy: if input matches what comes after *, transition immediately
      // This allows masks like #*# to work where the subsequent char is the same type
      if (
        (nextPattern && nextPattern.pattern.test(inputChar)) ||
        nextChar === inputChar
      ) {
        state.maskPosition = nextMaskPos;
      }
    }
  }

  private handleNonPatternChars(
    inputChar: string,
    mask: string,
    activePatterns: Record<string, IConfigPattern>,
    state: MaskState
  ): void {
    let maskChar = mask[state.maskPosition];

    while (
      maskChar &&
      !activePatterns[maskChar] &&
      !isQuantifier(maskChar) &&
      state.maskPosition < mask.length
    ) {
      // User typed the separator explicitly
      if (maskChar === inputChar) {
        state.masked += inputChar;
        state.maskPosition++;
        return;
      }

      // Auto-insert the separator
      state.masked += maskChar;
      state.maskPosition++;

      if (state.maskPosition >= mask.length) break;
      maskChar = mask[state.maskPosition];
    }

    // Stay on current input char to match against next pattern
    state.inputOffset = -1;
  }
}
