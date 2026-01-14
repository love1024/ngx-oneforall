/**
 * Quantifier characters that modify how patterns are matched
 */
export enum MaskQuantifier {
  /** Match zero or more occurrences of the preceding pattern */
  ZeroOrMore = '*',
  /** Match zero or one occurrence of the preceding pattern (optional) */
  Optional = '?',
}

export interface IConfigPattern {
  pattern: RegExp;
  symbol?: string;
}

export const patterns: Record<string, IConfigPattern> = {
  '0': {
    pattern: new RegExp('\\d'),
  },
  A: {
    pattern: new RegExp('[a-zA-Z0-9]'),
  },
  S: {
    pattern: new RegExp('[a-zA-Z]'),
  },
  U: {
    pattern: new RegExp('[A-Z]'),
  },
  L: {
    pattern: new RegExp('[a-z]'),
  },
};

/**
 * Check if a character is a quantifier
 */
export function isQuantifier(char: string): char is MaskQuantifier {
  return char === MaskQuantifier.ZeroOrMore || char === MaskQuantifier.Optional;
}
