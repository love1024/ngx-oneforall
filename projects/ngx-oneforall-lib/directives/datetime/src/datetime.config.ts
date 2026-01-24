/**
 * Date/Time format tokens with their validation rules.
 * Each token defines a pattern character sequence and its constraints.
 */
export interface DateTimeToken {
  /** Regex pattern for validation */
  pattern: RegExp;
  /** Maximum length of this token */
  length: number;
  /** Minimum valid value (for numeric tokens) */
  min?: number;
  /** Maximum valid value (for numeric tokens) */
  max?: number;
}

/**
 * Supported date/time format tokens.
 * Order matters - longer tokens should be checked first.
 */
export const DATE_TIME_TOKENS: Record<string, DateTimeToken> = {
  // Year
  YYYY: { pattern: /^\d{4}$/, length: 4, min: 1, max: 9999 },
  YY: { pattern: /^\d{2}$/, length: 2, min: 0, max: 99 },

  // Month
  MM: { pattern: /^(0[1-9]|1[0-2])$/, length: 2, min: 1, max: 12 },
  M: { pattern: /^(1[0-2]|[1-9])$/, length: 2, min: 1, max: 12 },

  // Day
  DD: {
    pattern: /^(0[1-9]|[12]\d|3[01])$/,
    length: 2,
    min: 1,
    max: 31,
  },
  D: {
    pattern: /^([12]\d|3[01]|[1-9])$/,
    length: 2,
    min: 1,
    max: 31,
  },

  // 24-hour format
  HH: { pattern: /^([01]\d|2[0-3])$/, length: 2, min: 0, max: 23 },
  H: { pattern: /^(1\d|2[0-3]|[0-9])$/, length: 2, min: 0, max: 23 },

  // 12-hour format
  hh: { pattern: /^(0[1-9]|1[0-2])$/, length: 2, min: 1, max: 12 },
  h: { pattern: /^(1[0-2]|[1-9])$/, length: 2, min: 1, max: 12 },

  // Minutes
  mm: { pattern: /^[0-5]\d$/, length: 2, min: 0, max: 59 },
  m: { pattern: /^[0-5]?\d$/, length: 2, min: 0, max: 59 },

  // Seconds
  ss: { pattern: /^[0-5]\d$/, length: 2, min: 0, max: 59 },
  s: { pattern: /^[0-5]?\d$/, length: 2, min: 0, max: 59 },

  // AM/PM
  A: { pattern: /^(AM|PM)$/, length: 2, min: 0, max: 1 },
  a: { pattern: /^(am|pm)$/, length: 2, min: 0, max: 1 },
};

/**
 * Ordered list of token names for parsing (longest first).
 */
export const TOKEN_NAMES = Object.keys(DATE_TIME_TOKENS).sort(
  (a, b) => b.length - a.length
);

/**
 * Default separators that are auto-inserted.
 */
export const DEFAULT_DATE_SEPARATORS = ['-', '/', '.', ':', ' '];

/**
 * Partial input validation rules for progressive typing.
 * Maps token name to a function that validates partial input.
 */
export const PARTIAL_VALIDATORS: Record<string, (partial: string) => boolean> =
  {
    YYYY: p => /^\d{0,4}$/.test(p),
    YY: p => /^\d{0,2}$/.test(p),
    MM: p => {
      if (p.length === 0) return true;
      if (p.length === 1) return /^[01]$/.test(p);
      return /^(0[1-9]|1[0-2])$/.test(p);
    },
    M: p => /^(1[0-2]?|[2-9])?$/.test(p),
    DD: p => {
      if (p.length === 0) return true;
      if (p.length === 1) return /^[0-3]$/.test(p);
      return /^(0[1-9]|[12]\d|3[01])$/.test(p);
    },
    D: p => /^([12]\d?|3[01]?|[4-9])?$/.test(p),
    HH: p => {
      if (p.length === 0) return true;
      if (p.length === 1) return /^[0-2]$/.test(p);
      return /^([01]\d|2[0-3])$/.test(p);
    },
    H: p => /^(1\d?|2[0-3]?|[0-9])?$/.test(p),
    hh: p => {
      if (p.length === 0) return true;
      if (p.length === 1) return /^[01]$/.test(p);
      return /^(0[1-9]|1[0-2])$/.test(p);
    },
    h: p => /^(1[0-2]?|[1-9])?$/.test(p),
    mm: p => {
      if (p.length === 0) return true;
      if (p.length === 1) return /^[0-5]$/.test(p);
      return /^[0-5]\d$/.test(p);
    },
    m: p => /^[0-5]?\d?$/.test(p),
    ss: p => {
      if (p.length === 0) return true;
      if (p.length === 1) return /^[0-5]$/.test(p);
      return /^[0-5]\d$/.test(p);
    },
    s: p => /^[0-5]?\d?$/.test(p),
    A: p => /^(A|AM|P|PM)?$/i.test(p),
    a: p => /^(a|am|p|pm)?$/i.test(p),
  };
