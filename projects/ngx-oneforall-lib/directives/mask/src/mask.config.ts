export interface IConfigPattern {
  pattern: RegExp;
  optional?: boolean;
  symbol?: string;
}

export const patterns: Record<string, IConfigPattern> = {
  '0': {
    pattern: new RegExp('\\d'),
  },
  '9': {
    pattern: new RegExp('\\d'),
    optional: true,
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
