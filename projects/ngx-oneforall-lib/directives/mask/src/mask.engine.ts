import {
  DEFAULT_SPECIAL_CHARACTERS,
  IConfigPattern,
  MaskQuantifier,
  patterns,
} from './mask.config';
import { canSkipOptional, isQuantifier } from './mask.utils';

/**
 * Configuration options for mask application.
 */
export interface MaskConfig {
  /** String to prepend to the masked result. Default: '' */
  prefix?: string;
  /** String to append to the masked result. Default: '' */
  suffix?: string;
  /** Array of characters treated as separator/literal characters in the mask. Default: DEFAULT_SPECIAL_CHARACTERS */
  specialCharacters?: string[];
  /** If true, merges the provided specialCharacters with the defaults. Default: false */
  mergeSpecialChars?: boolean;
  /** Custom pattern definitions to extend or override the built-in patterns. Default: {} */
  customPatterns?: Record<string, IConfigPattern>;
  /** If true, raw output excludes special characters (separators). Default: true */
  removeSpecialCharacters?: boolean;
}

interface MaskState {
  raw: string;
  masked: string;
  maskPosition: number;
  inputOffset: number;
}

/**
 * Result of applying a mask to an input value.
 */
export interface MaskResult {
  /** The formatted output with mask separators applied */
  masked: string;
  /** The raw input characters that matched mask patterns */
  raw: string;
  /** The mask position reached after processing */
  maskEndPosition: number;
  /** The computed cursor position (only meaningful when cursorPosition is provided) */
  newCursorPosition: number;
}

/**
 * Resolve merged patterns from built-in patterns + custom patterns.
 */
function resolvePatterns(
  customPatterns?: Record<string, IConfigPattern>
): Record<string, IConfigPattern> {
  return { ...patterns, ...(customPatterns ?? {}) };
}

/**
 * Resolve effective special characters based on merge flag.
 */
function resolveSpecialCharacters(
  specialCharacters?: string[],
  mergeSpecialChars?: boolean
): string[] {
  const special = specialCharacters ?? DEFAULT_SPECIAL_CHARACTERS;
  if (mergeSpecialChars) {
    return Array.from(new Set([...DEFAULT_SPECIAL_CHARACTERS, ...special]));
  }
  return special;
}

/**
 * Remove prefix and suffix from a value string.
 */
function removePrefixSuffix(
  value: string,
  prefix: string,
  suffix: string
): string {
  let result = value;
  if (result.startsWith(prefix)) {
    result = result.slice(prefix.length);
  }
  if (suffix.length > 0 && result.endsWith(suffix)) {
    result = result.slice(0, -suffix.length);
  }
  return result;
}

/**
 * Constrain cursor position within prefix/suffix bounds.
 */
function constrainCursor(
  position: number,
  totalLength: number,
  prefixLength: number,
  suffixLength: number
): number {
  /* istanbul ignore if -- defensive guard; cursor is always in bounds after applyMask arithmetic */
  if (position < prefixLength) {
    return prefixLength;
  }
  /* istanbul ignore if -- defensive guard; cursor is always in bounds after applyMask arithmetic */
  if (position > totalLength - suffixLength) {
    return totalLength - suffixLength;
  }
  return position;
}

function handlePatternChar(
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
      handleZeroOrMoreTransition(inputChar, state, mask, activePatterns);
      return;
    }

    // For ? quantifier as next, move one more step to pass it as well
    state.maskPosition += quantifier ? 2 : 1;
  } else if (isOptional) {
    const nextMaskPos = state.maskPosition + (quantifier ? 2 : 1);

    // Use the robust utility to check if we can skip
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

function handleZeroOrMoreTransition(
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
    if (
      (nextPattern && nextPattern.pattern.test(inputChar)) ||
      nextChar === inputChar
    ) {
      state.maskPosition = nextMaskPos;
    }
  }
}

function handleNonPatternChars(
  inputChar: string,
  mask: string,
  activePatterns: Record<string, IConfigPattern>,
  state: MaskState,
  removeSpecialCharacters: boolean
): void {
  let maskChar = mask[state.maskPosition];

  while (
    maskChar &&
    !activePatterns[maskChar] &&
    !isQuantifier(maskChar) &&
    state.maskPosition < mask.length
  ) {
    // Auto-insert the separator
    state.masked += maskChar;

    // Add to raw value conditions:
    // ONLY add if removeSpecialCharacters is FALSE.
    if (!removeSpecialCharacters) {
      state.raw += maskChar;
    }

    state.maskPosition++;

    // User typed the separator explicitly
    if (maskChar === inputChar) {
      return;
    }

    if (state.maskPosition >= mask.length) break;
    maskChar = mask[state.maskPosition];
  }

  // Stay on current input char to match against next pattern
  state.inputOffset = -1;
}

/**
 * Validates that a mask string only contains pattern characters, quantifiers,
 * and declared special characters.
 *
 * @throws Error if the mask contains an undeclared character
 */
export function validateMask(mask: string, config?: MaskConfig): void {
  const activePatterns = resolvePatterns(config?.customPatterns);
  const specialCharacters = resolveSpecialCharacters(
    config?.specialCharacters,
    config?.mergeSpecialChars
  );

  for (const char of mask) {
    if (!activePatterns[char] && !isQuantifier(char)) {
      if (!specialCharacters.includes(char)) {
        throw new Error(
          `Mask contains non-pattern character '${char}' which is not in specialCharacters list.`
        );
      }
    }
  }
}

/**
 * Pure function that applies a mask pattern to an input string.
 *
 * This is the core masking engine used by both `MaskDirective` and `MaskPipe`.
 *
 * @param inputValue - The raw input string to mask
 * @param mask - The mask pattern (e.g., '(###) ###-####')
 * @param config - Optional configuration for prefix, suffix, patterns, etc.
 * @param cursorPosition - Optional cursor position for tracking (directive use).
 *   When undefined, cursor tracking is skipped.
 * @returns The mask result containing masked output, raw value, and cursor info
 *
 * @usageNotes
 * ```typescript
 * // Simple usage (pipe)
 * const result = applyMask('1234567890', '(###) ###-####');
 * result.masked // '(123) 456-7890'
 *
 * // With config
 * const result = applyMask('1234567890', '(###) ###-####', { prefix: '+1 ' });
 * result.masked // '+1 (123) 456-7890'
 *
 * // With cursor tracking (directive)
 * const result = applyMask('1234567890', '(###) ###-####', {}, 5);
 * result.newCursorPosition // computed cursor position
 * ```
 */
export function applyMask(
  inputValue: string,
  mask: string,
  config?: MaskConfig,
  cursorPosition?: number
): MaskResult {
  const activePatterns = resolvePatterns(config?.customPatterns);
  const prefix = config?.prefix ?? '';
  const suffix = config?.suffix ?? '';
  const removeSpecialChars = config?.removeSpecialCharacters ?? true;
  const trackCursor = cursorPosition !== undefined;

  let raw = '';
  let masked = '';
  let maskPosition = 0;
  let newCursorPosition = 0;
  let cursorSet = false;

  // Remove prefix and suffix from input for processing
  const processingValue = removePrefixSuffix(inputValue, prefix, suffix);
  let adjustedCursorPosition = cursorPosition ?? 0;

  if (trackCursor) {
    if (inputValue.startsWith(prefix)) {
      adjustedCursorPosition -= prefix.length;
    }
    // Adjust cursor if it was negative (in prefix area)
    if (adjustedCursorPosition < 0) adjustedCursorPosition = 0;
  }

  for (
    let i = 0;
    i < processingValue.length && maskPosition < mask.length;
    i++
  ) {
    // Track cursor position mapping
    if (trackCursor && i === adjustedCursorPosition) {
      newCursorPosition = masked.length;
      cursorSet = true;
    }

    const inputChar = processingValue[i];
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
      handlePatternChar(
        inputChar,
        pattern,
        quantifier,
        state,
        mask,
        activePatterns,
        processingValue,
        i
      );
    } else if (!isQuantifier(maskChar)) {
      handleNonPatternChars(
        inputChar,
        mask,
        activePatterns,
        state,
        removeSpecialChars
      );
    }

    raw = state.raw;
    masked = state.masked;
    maskPosition = state.maskPosition;
    i += state.inputOffset;
  }

  // Handle cursor at the very end or if loop terminated early (mask full)
  if (trackCursor && !cursorSet && adjustedCursorPosition > 0) {
    newCursorPosition = masked.length;
  }

  // Add prefix and suffix to masked result only if there is content
  if (masked) {
    masked = prefix + masked + suffix;

    if (trackCursor) {
      // Adjust cursor position to account for prefix
      newCursorPosition += prefix.length;

      newCursorPosition = constrainCursor(
        newCursorPosition,
        masked.length,
        prefix.length,
        suffix.length
      );
    }
  } else {
    newCursorPosition = 0;
  }

  return { masked, raw, maskEndPosition: maskPosition, newCursorPosition };
}
