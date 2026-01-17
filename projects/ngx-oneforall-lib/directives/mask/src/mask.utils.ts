import { MaskQuantifier } from './mask.config';

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
