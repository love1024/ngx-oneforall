import {
  DATE_TIME_TOKENS,
  DateTimeToken,
  DEFAULT_DATE_SEPARATORS,
  PARTIAL_VALIDATORS,
  TOKEN_NAMES,
} from './datetime.config';

/**
 * Mapping of date/time parts to their corresponding token names.
 */
const PART_TOKENS: Record<string, string[]> = {
  year: ['YYYY', 'YY'],
  month: ['MM', 'M'],
  day: ['DD', 'D'],
  hour: ['HH', 'H', 'hh', 'h'],
  minute: ['mm', 'm'],
  second: ['ss', 's'],
};

/**
 * Parsed token from a format string.
 */
// Discriminated union for strict typing
export type ParsedToken =
  | {
      isToken: true;
      value: string;
      /** Token configuration */
      config: DateTimeToken;
    }
  | {
      isToken: false;
      value: string;
      config?: never;
    };

/**
 * Parse a format string into an array of tokens.
 * E.g., "MM-DD-YYYY" -> [{ value: 'MM', isToken: true }, { value: '-', isToken: false }, ...]
 */
export function parseFormat(format: string): ParsedToken[] {
  const tokens: ParsedToken[] = [];
  let remaining = format;

  while (remaining.length > 0) {
    let matched = false;

    // Try to match a known token (longest first)
    for (const tokenName of TOKEN_NAMES) {
      if (remaining.startsWith(tokenName)) {
        tokens.push({
          value: tokenName,
          isToken: true,
          config: DATE_TIME_TOKENS[tokenName],
        });
        remaining = remaining.slice(tokenName.length);
        matched = true;
        break;
      }
    }

    // If no token matched, treat the first character as a separator
    if (!matched) {
      tokens.push({
        value: remaining[0],
        isToken: false,
      });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}

/**
 * Check if a partial input is valid for a given token.
 */
export function isValidPartialInput(
  partial: string,
  tokenName: string
): boolean {
  const validator = PARTIAL_VALIDATORS[tokenName];
  return validator ? validator(partial) : false;
}

/**
 * Check if a complete input is valid for a given token.
 */
export function isValidCompleteInput(
  value: string,
  tokenName: string
): boolean {
  const tokenConfig = DATE_TIME_TOKENS[tokenName];
  if (!tokenConfig) return false;
  return tokenConfig.pattern.test(value);
}

/**
 * Check if a character is a valid separator.
 */
export function isSeparator(char: string): boolean {
  return DEFAULT_DATE_SEPARATORS.includes(char);
}

/**
 * Get the number of days in a given month.
 */
export function getDaysInMonth(month: number, year: number): number {
  // Month is 1-indexed (1 = January)
  return new Date(year, month, 0).getDate();
}

/**
 * Validate that a day value is valid for the given month and year.
 */
export function isValidDay(day: number, month: number, year: number): boolean {
  if (day < 1) return false;
  const maxDays = getDaysInMonth(month, year);
  return day <= maxDays;
}

/**
 * Internal function to extract numeric value from a date string.
 * Returns undefined if the part is not present or invalid.
 */
function extractDatePartInternal(
  value: string,
  format: string,
  part: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second',
  isRaw: boolean
): number | undefined {
  const tokens = parseFormat(format);
  let position = 0;

  for (const token of tokens) {
    if (!token.isToken) {
      // For formatted values, separators take up 1 character
      // For raw values, separators don't exist in the input
      if (!isRaw) position += 1;
      continue;
    }

    if (PART_TOKENS[part].includes(token.value)) {
      const length = token.config.length;
      const extracted = value.slice(position, position + length);
      const num = parseInt(extracted, 10);
      if (!isNaN(num)) {
        // Handle 2-digit year
        if (token.value === 'YY') {
          return num >= 50 ? 1900 + num : 2000 + num;
        }
        return num;
      }
      return undefined;
    }
    position += token.config.length;
  }

  return undefined;
}

/**
 * Extract numeric value from a formatted date string (with separators).
 * Returns undefined if the part is not present or invalid.
 */
export function extractDatePart(
  value: string,
  format: string,
  part: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
): number | undefined {
  return extractDatePartInternal(value, format, part, false);
}

/**
 * Calculate the expected length based on format and whether it's raw.
 */
function calculateExpectedLength(format: string, isRaw: boolean): number {
  const tokens = parseFormat(format);
  return tokens.reduce((sum, token) => {
    if (token.isToken) return sum + token.config.length;
    return isRaw ? sum : sum + 1;
  }, 0);
}

/**
 * Calculate the expected length of a fully formatted value.
 */
export function getExpectedLength(format: string): number {
  return calculateExpectedLength(format, false);
}

/**
 * Calculate the expected length of a raw value (without separators).
 */
export function getRawExpectedLength(format: string): number {
  return calculateExpectedLength(format, true);
}

/**
 * Extract numeric value from a raw (separator-free) date string.
 * Returns undefined if the part is not present or invalid.
 */
export function extractDatePartFromRaw(
  value: string,
  format: string,
  part: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'
): number | undefined {
  return extractDatePartInternal(value, format, part, true);
}
