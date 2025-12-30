/**
 * Time duration constants in milliseconds.
 * Useful for timeouts, intervals, and date calculations.
 *
 * @example
 * setTimeout(callback, TIME.Second * 5); // 5 seconds
 */
export const TIME = {
  /** 1 second in milliseconds. */
  Second: 1000,
  /** 1 minute in milliseconds. */
  Minute: 60_000,
  /** 1 hour in milliseconds. */
  Hour: 3_600_000,
  /** 1 day in milliseconds. */
  Day: 86_400_000,
  /** 1 week in milliseconds. */
  Week: 604_800_000,
} as const;
