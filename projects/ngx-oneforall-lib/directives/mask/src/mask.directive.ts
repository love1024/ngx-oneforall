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
import { getExpectedLength, isQuantifier } from './mask.utils';

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
    const { masked, raw } = this.applyMask(input.value, this.mask());
    input.value = masked;
    this.onChange(raw);
  }

  onBlur() {
    this.onTouched();

    if (this.clearIfNotMatch()) {
      const mask = this.mask();
      const currentValue = this.elementRef.nativeElement.value;
      const expectedLength = getExpectedLength(mask);

      if (currentValue.length < expectedLength) {
        this.elementRef.nativeElement.value = '';
        this.onChange('');
      }
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const mask = this.mask();
    const { masked } = this.applyMask(value, mask);
    const expectedLength = getExpectedLength(mask);

    // Check if input is complete (matches expected mask length)
    if (masked.length < expectedLength) {
      return {
        mask: {
          requiredMask: mask,
          actualValue: masked,
        },
      };
    }

    return null;
  }

  private applyMask(
    inputValue: string,
    mask: string
  ): { masked: string; raw: string } {
    const activePatterns = this.mergedPatterns();
    let raw = '';
    let masked = '';
    let maskPosition = 0;

    for (let i = 0; i < inputValue.length && maskPosition < mask.length; i++) {
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
        this.handlePatternChar(inputChar, pattern, quantifier, state);
      } else if (!isQuantifier(maskChar)) {
        this.handleNonPatternChars(inputChar, mask, activePatterns, state);
      }

      raw = state.raw;
      masked = state.masked;
      maskPosition = state.maskPosition;
      i += state.inputOffset;
    }

    return { masked, raw };
  }

  private handlePatternChar(
    inputChar: string,
    pattern: IConfigPattern,
    quantifier: MaskQuantifier | null,
    state: MaskState
  ): void {
    const matches = pattern.pattern.test(inputChar);
    // Treat pattern.optional as equivalent to ? quantifier
    const isOptional =
      pattern.optional ||
      quantifier === MaskQuantifier.Optional ||
      quantifier === MaskQuantifier.ZeroOrMore;

    if (matches) {
      state.raw += inputChar;
      state.masked += inputChar;

      // For * quantifier, stay on the same pattern (don't advance mask position)
      if (quantifier === MaskQuantifier.ZeroOrMore) {
        // Don't advance maskPosition - allow more matches
        return;
      }

      // For ? quantifier as next, move one more step to pass it as well
      state.maskPosition += quantifier ? 2 : 1;
    } else if (isOptional) {
      // Optional pattern - skip pattern (and quantifier if present), retry input
      state.maskPosition += quantifier ? 2 : 1;
      state.inputOffset = -1;
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
