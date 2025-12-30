/**
 * Sort direction values for ordering data.
 */
export const SORT_DIRECTION = {
  /** Ascending order (A-Z, 0-9). */
  Asc: 'asc',
  /** Descending order (Z-A, 9-0). */
  Desc: 'desc',
} as const;

/** Union type of sort directions. */
export type SortDirection =
  (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];
