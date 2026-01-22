/**
 * Quantifier characters that modify how patterns are matched
 */
export enum MaskQuantifier {
  /** Match zero or more occurrences of the preceding pattern */
  ZeroOrMore = '*',
  /** Match zero or one occurrence of the preceding pattern (optional) */
  Optional = '?',
}

/**
 * Configuration for a mask pattern character.
 */
export interface IConfigPattern {
  /** The regex pattern that the input character must match */
  pattern: RegExp;
  /** If true, this pattern is optional (equivalent to ? quantifier) */
  optional?: boolean;
}

export const patterns: Record<string, IConfigPattern> = {
  '#': {
    pattern: new RegExp('\\d'),
  },
  A: {
    pattern: new RegExp('[a-zA-Z0-9]'),
  },
  '@': {
    pattern: new RegExp('[a-zA-Z]'),
  },
  U: {
    pattern: new RegExp('[A-Z]'),
  },
  L: {
    pattern: new RegExp('[a-z]'),
  },
};

export const DEFAULT_SPECIAL_CHARACTERS = [
  '-',
  '/',
  '(',
  ')',
  '.',
  ':',
  ' ',
  '+',
  ',',
  '@',
  '[',
  ']',
  '"',
  "'",
];
