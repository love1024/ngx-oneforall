import { Directive, input } from '@angular/core';
import { IConfigPattern, patterns } from './mask.config';

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

      const pattern = patterns[maskChar];
      const state: MaskState = { result, maskPosition, inputOffset: 0 };

      if (pattern) {
        this.handlePatternChar(inputChar, pattern, state);
      } else {
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
    state: MaskState
  ): void {
    if (pattern.pattern.test(inputChar)) {
      state.result += inputChar;
      state.maskPosition++;
    } else if (pattern.optional) {
      state.maskPosition++;
      state.inputOffset = -1; // Retry this input char with next mask char
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
