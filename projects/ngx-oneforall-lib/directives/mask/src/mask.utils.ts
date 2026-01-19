import { IConfigPattern, MaskQuantifier } from './mask.config';

/**
 * Check if a character is a quantifier (? or *)
 */
export function isQuantifier(char: string): char is MaskQuantifier {
  return char === MaskQuantifier.Optional || char === MaskQuantifier.ZeroOrMore;
}

/**
 * Calculate the expected minimum number of raw input characters for a mask.
 * Only counts required pattern positions (not literals).
 * Optional patterns (followed by ? or *) are excluded from the count.
 */
export function getExpectedLength(
  mask: string,
  patternConfig: Record<string, { pattern: RegExp; optional?: boolean }>
): number {
  // First, find the position of the last REQUIRED pattern in the mask
  let lastRequiredMaskIndex = -1;

  for (let i = 0; i < mask.length; i++) {
    const char = mask[i];
    const nextChar = mask[i + 1];

    if (isQuantifier(char)) {
      continue;
    }

    // Check if this position is optional
    const isOptional =
      nextChar === MaskQuantifier.Optional ||
      nextChar === MaskQuantifier.ZeroOrMore;

    if (isOptional) {
      i++; // Skip the quantifier
      continue;
    }

    // This is a required position (pattern or literal)
    // Only count it if it's a pattern character (not a literal)
    if (patternConfig[mask[i]]) {
      lastRequiredMaskIndex = i;
    }
  }

  if (lastRequiredMaskIndex === -1) {
    return 0; // All patterns are optional
  }

  // Now count the length from start to lastRequiredMaskIndex (inclusive)
  // skipping quantifiers and optional patterns
  let length = 0;
  for (let i = 0; i <= lastRequiredMaskIndex; i++) {
    const char = mask[i];
    const nextChar = mask[i + 1];

    if (isQuantifier(char)) {
      continue;
    }

    const isOptional =
      nextChar === MaskQuantifier.Optional ||
      nextChar === MaskQuantifier.ZeroOrMore;

    if (isOptional) {
      i++;
      continue;
    }

    // Only count pattern characters, not literals
    if (patternConfig[mask[i]]) {
      length++;
    }
  }

  return length;
}

/**
 * Calculate the minimum mask position that must be reached for validation to pass.
 * This is the position just after the last REQUIRED pattern in the mask.
 * If all patterns are optional, returns 0.
 */
export function getRequiredEndPosition(
  mask: string,
  patternConfig: Record<string, { pattern: RegExp; optional?: boolean }>
): number {
  let lastRequiredPos = -1;

  for (let i = 0; i < mask.length; i++) {
    const char = mask[i];
    const nextChar = mask[i + 1];

    if (isQuantifier(char)) {
      continue;
    }

    const isOptional =
      nextChar === MaskQuantifier.Optional ||
      nextChar === MaskQuantifier.ZeroOrMore;

    if (isOptional) {
      i++; // Skip the quantifier
      continue;
    }

    // This is a required position - track it if it's a pattern character
    if (patternConfig[char]) {
      // The position AFTER this pattern (including any quantifier) must be reached
      lastRequiredPos = i + 1;
    }
  }

  return lastRequiredPos === -1 ? 0 : lastRequiredPos;
}

/**
 * Determine if we can safely skip an optional pattern.
 * Uses smart lookahead to prevent skipping if valid inputs are waiting.
 */
export function canSkipOptional(
  inputChar: string,
  mask: string,
  currentMaskPos: number,
  patterns: Record<string, IConfigPattern>,
  inputValue: string,
  inputIndex: number,
  nextMaskPos: number // where we would jump to if we skip
): { canSkip: boolean; skipToPos: number } {
  let scanPos = nextMaskPos;

  // Scan through consecutive optional patterns to find first non-optional
  while (scanPos < mask.length) {
    const scanChar = mask[scanPos];
    const scanNextChar = mask[scanPos + 1];

    if (isQuantifier(scanChar)) {
      scanPos++;
      continue;
    }

    const scanPattern = patterns[scanChar];
    const isScanOptional =
      scanPattern?.optional ||
      scanNextChar === MaskQuantifier.Optional ||
      scanNextChar === MaskQuantifier.ZeroOrMore;

    if (isScanOptional) {
      // Skip this additional optional pattern
      scanPos += scanNextChar && isQuantifier(scanNextChar) ? 2 : 1;
      continue;
    }

    // Found first non-optional position - check if input matches
    if (scanPattern?.pattern.test(inputChar) || scanChar === inputChar) {
      // Count ALL remaining input chars that match the current optional pattern
      // These are chars that SHOULD fill the optionals we'd be skipping
      // Note: We need the original pattern from the optional we are considering skipping.
      // We don't have it passed in explicitly, but we can assume typical usage.
      // Wait, we need the pattern of the optional we are skipping.
      // Let's grab it from currentMaskPos?
      const currentMaskChar = mask[currentMaskPos];
      const currentPattern = patterns[currentMaskChar];

      if (currentPattern) {
        let matchingInputCount = 0;
        for (let k = inputIndex + 1; k < inputValue.length; k++) {
          const futureChar = inputValue[k];
          if (currentPattern.pattern.test(futureChar)) {
            matchingInputCount++;
          }
        }

        // Count positions after the matched literal (available for matching inputs)
        let positionsAfterMatch = 0;
        for (let j = scanPos + 1; j < mask.length; j++) {
          const afterChar = mask[j];
          if (isQuantifier(afterChar)) continue;
          const afterPattern = patterns[afterChar];
          if (afterPattern) positionsAfterMatch++;
        }

        // Only allow skip if there's room for ALL matching inputs after the match
        const shouldBlockSkip = matchingInputCount > positionsAfterMatch;

        if (shouldBlockSkip) {
          return { canSkip: false, skipToPos: -1 };
        }
      }

      return { canSkip: true, skipToPos: scanPos };
    }
    // Whether matched or not, stop scanning
    break;
  }

  return { canSkip: false, skipToPos: scanPos };
}
