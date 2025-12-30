/**
 * Common regular expression patterns for validation.
 *
 * @example
 * REGEX.Numeric.test('123'); // true
 * REGEX.Alpha.test('abc'); // true
 */
export const REGEX = {
  /** Matches positive integers only (no sign). */
  Numeric: /^\d+$/,
  /** Matches integers (positive or negative). */
  Integer: /^-?\d+$/,
  /** Matches decimal numbers (positive or negative). */
  Decimal: /^-?\d+(\.\d+)?$/,
  /** Matches positive integers (same as Numeric). */
  PositiveInteger: /^\d+$/,
  /** Matches negative integers only. */
  NegativeInteger: /^-\d+$/,

  /** Matches alphabetic characters only (a-z, A-Z). */
  Alpha: /^[a-zA-Z]+$/,
  /** Matches lowercase letters only. */
  AlphaLower: /^[a-z]+$/,
  /** Matches uppercase letters only. */
  AlphaUpper: /^[A-Z]+$/,
  /** Matches alphanumeric characters (a-z, A-Z, 0-9). */
  AlphaNumeric: /^[a-zA-Z0-9]+$/,
} as const;
