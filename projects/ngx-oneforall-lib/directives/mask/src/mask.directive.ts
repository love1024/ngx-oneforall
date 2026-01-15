import { computed, Directive, forwardRef, input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { IConfigPattern, MaskQuantifier, patterns } from './mask.config';
import { getExpectedLength, isQuantifier } from './mask.utils';

interface MaskState {
  result: string;
  maskPosition: number;
  inputOffset: number;
}

@Directive({
  selector: '[mask]',
  host: {
    '(input)': 'onInput($event)',
  },
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaskDirective),
      multi: true,
    },
  ],
})
export class MaskDirective implements Validator {
  mask = input.required<string>();

  customPatterns = input<Record<string, IConfigPattern>>({});

  private mergedPatterns = computed(() => ({
    ...patterns,
    ...this.customPatterns(),
  }));

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = this.applyMask(input.value, this.mask());
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const mask = this.mask();
    const maskedValue = this.applyMask(value, mask);
    const expectedLength = getExpectedLength(mask);

    // Check if input is complete (matches expected mask length)
    if (maskedValue.length < expectedLength) {
      return {
        mask: {
          requiredMask: mask,
          actualValue: maskedValue,
        },
      };
    }

    return null;
  }

  private applyMask(inputValue: string, mask: string): string {
    const activePatterns = this.mergedPatterns();
    let result = '';
    let maskPosition = 0;

    for (let i = 0; i < inputValue.length && maskPosition < mask.length; i++) {
      const inputChar = inputValue[i];
      const maskChar = mask[maskPosition];
      const nextChar = mask[maskPosition + 1];
      const quantifier = isQuantifier(nextChar) ? nextChar : null;

      const pattern = activePatterns[maskChar];
      const state: MaskState = { result, maskPosition, inputOffset: 0 };

      if (pattern) {
        this.handlePatternChar(inputChar, pattern, quantifier, state);
      } else if (!isQuantifier(maskChar)) {
        this.handleNonPatternChars(inputChar, mask, activePatterns, state);
      }

      result = state.result;
      maskPosition = state.maskPosition;
      i += state.inputOffset;
    }

    return result;
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
      state.result += inputChar;

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
        state.result += inputChar;
        state.maskPosition++;
        return;
      }

      // Auto-insert the separator
      state.result += maskChar;
      state.maskPosition++;

      if (state.maskPosition >= mask.length) break;
      maskChar = mask[state.maskPosition];
    }

    // Stay on current input char to match against next pattern
    state.inputOffset = -1;
  }
}
