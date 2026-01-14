import { Directive, input } from '@angular/core';
import {
  IConfigPattern,
  isQuantifier,
  MaskQuantifier,
  patterns,
} from './mask.config';

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
})
export class MaskDirective {
  mask = input.required<string>();

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = this.applyMask(input.value, this.mask());
  }

  private applyMask(inputValue: string, mask: string): string {
    let result = '';
    let maskPosition = 0;

    for (let i = 0; i < inputValue.length && maskPosition < mask.length; i++) {
      const inputChar = inputValue[i];
      const maskChar = mask[maskPosition];
      const nextChar = mask[maskPosition + 1];
      const quantifier = isQuantifier(nextChar) ? nextChar : null;

      const pattern = patterns[maskChar];
      const state: MaskState = { result, maskPosition, inputOffset: 0 };

      if (pattern) {
        this.handlePatternChar(inputChar, pattern, quantifier, state);
      } else if (!isQuantifier(maskChar)) {
        this.handleNonPatternChars(inputChar, mask, state);
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

    if (matches) {
      state.result += inputChar;

      // For * quantifier, stay on the same pattern (don't advance mask position)
      if (quantifier === MaskQuantifier.ZeroOrMore) {
        // Don't advance maskPosition - allow more matches
        return;
      }

      // For ? qunatifier as next, move one more step to pass it as well
      state.maskPosition += quantifier ? 2 : 1;
    } else if (
      quantifier === MaskQuantifier.Optional ||
      quantifier === MaskQuantifier.ZeroOrMore
    ) {
      // Optional or zero or more quantifier - skip pattern and quantifier, retry input
      state.maskPosition += 2;
      state.inputOffset = -1;
    }
  }

  private handleNonPatternChars(
    inputChar: string,
    mask: string,
    state: MaskState
  ): void {
    let maskChar = mask[state.maskPosition];

    while (
      maskChar &&
      !patterns[maskChar] &&
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
