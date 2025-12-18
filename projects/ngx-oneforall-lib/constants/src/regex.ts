export const REGEX = {
  Numeric: /^\d+$/,
  Integer: /^-?\d+$/,
  Decimal: /^-?\d+(\.\d+)?$/,
  PositiveInteger: /^\d+$/,
  NegativeInteger: /^-\d+$/,

  Alpha: /^[a-zA-Z]+$/,
  AlphaLower: /^[a-z]+$/,
  AlphaUpper: /^[A-Z]+$/,
  AlphaNumeric: /^[a-zA-Z0-9]+$/,
} as const;
