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
    const { raw } = this.applyMask(value, mask);
    const expectedLength = getExpectedLength(mask, activePatterns);

    // Check if input is complete (has enough raw characters)
    if (raw.length < expectedLength) {
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
        this.handlePatternChar(
          inputChar,
          pattern,
          quantifier,
          state,
          mask,
          activePatterns
        );
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
    state: MaskState,
    mask: string,
    activePatterns: Record<string, IConfigPattern>
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
        return;
      }

      // For ? quantifier as next, move one more step to pass it as well
      state.maskPosition += quantifier ? 2 : 1;
    } else if (isOptional) {
      // Mismatch on optional pattern.
      // Check if input matches any FUTURE pattern/literal in the mask.
      // If yes, this optional pattern was skipped -> Advance mask.
      // If no, this input is junk -> Skip input (do nothing to state).

      const nextMaskPos = state.maskPosition + (quantifier ? 2 : 1);
      let isFutureMatch = false;

      for (let i = nextMaskPos; i < mask.length; i++) {
        const char = mask[i];
        if (
          char === MaskQuantifier.Optional ||
          char === MaskQuantifier.ZeroOrMore
        ) {
          continue;
        }

        const p = activePatterns[char];
        if (p?.pattern.test(inputChar) || char === inputChar) {
          isFutureMatch = true;
          break;
        }
      }

      if (isFutureMatch) {
        state.maskPosition = nextMaskPos;
        state.inputOffset = -1;
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
