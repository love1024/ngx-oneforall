import { MaskQuantifier } from './mask.config';

/**
 * Check if a character is a quantifier (? or *)
 */
export function isQuantifier(char: string): char is MaskQuantifier {
  return char === MaskQuantifier.Optional || char === MaskQuantifier.ZeroOrMore;
}

/**
 * Calculate the expected minimum length for a mask pattern.
 * Optional patterns (followed by ? or *) are excluded from the count.
 */
export function getExpectedLength(mask: string): number {
  let length = 0;
  for (let i = 0; i < mask.length; i++) {
    const char = mask[i];
    const nextChar = mask[i + 1];

    if (isQuantifier(char)) {
      continue;
    }

    if (
      nextChar === MaskQuantifier.Optional ||
      nextChar === MaskQuantifier.ZeroOrMore
    ) {
      i++;
      continue;
    }

    length++;
  }
  return length;
}
