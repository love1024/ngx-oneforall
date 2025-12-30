/**
 * Responsive breakpoint tokens for use with media queries.
 * Follows Bootstrap-like naming convention.
 */
export const BREAKPOINT = {
  /** Extra small: < 576px */
  XS: 'xs',
  /** Small: >= 576px */
  SM: 'sm',
  /** Medium: >= 768px */
  MD: 'md',
  /** Large: >= 992px */
  LG: 'lg',
  /** Extra large: >= 1200px */
  XL: 'xl',
  /** Extra extra large: >= 1400px */
  XXL: 'xxl',

  /** Small only: 576px - 767px */
  SM_ONLY: 'smOnly',
  /** Medium only: 768px - 991px */
  MD_ONLY: 'mdOnly',
  /** Large only: 992px - 1199px */
  LG_ONLY: 'lgOnly',
  /** Extra large only: 1200px - 1399px */
  XL_ONLY: 'xlOnly',
} as const;

/**
 * Breakpoint values in pixels.
 */
export const BREAKPOINT_VALUE = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
} as const;

/** Union type of all breakpoint tokens. */
export type Breakpoint = (typeof BREAKPOINT)[keyof typeof BREAKPOINT];

/**
 * Pre-built CSS media query strings for each breakpoint.
 * Ready to use with `window.matchMedia()` or CSS-in-JS.
 *
 * @example
 * window.matchMedia(BREAKPOINT_QUERY.md).matches; // true if viewport >= 768px
 */
export const BREAKPOINT_QUERY = {
  [BREAKPOINT.XS]: `(max-width: ${BREAKPOINT_VALUE.SM - 0.02}px)`,

  [BREAKPOINT.SM]: `(min-width: ${BREAKPOINT_VALUE.SM}px)`,
  [BREAKPOINT.MD]: `(min-width: ${BREAKPOINT_VALUE.MD}px)`,
  [BREAKPOINT.LG]: `(min-width: ${BREAKPOINT_VALUE.LG}px)`,
  [BREAKPOINT.XL]: `(min-width: ${BREAKPOINT_VALUE.XL}px)`,
  [BREAKPOINT.XXL]: `(min-width: ${BREAKPOINT_VALUE.XXL}px)`,

  [BREAKPOINT.SM_ONLY]: `(min-width: ${BREAKPOINT_VALUE.SM}px) and (max-width: ${BREAKPOINT_VALUE.MD - 0.02}px)`,
  [BREAKPOINT.MD_ONLY]: `(min-width: ${BREAKPOINT_VALUE.MD}px) and (max-width: ${BREAKPOINT_VALUE.LG - 0.02}px)`,
  [BREAKPOINT.LG_ONLY]: `(min-width: ${BREAKPOINT_VALUE.LG}px) and (max-width: ${BREAKPOINT_VALUE.XL - 0.02}px)`,
  [BREAKPOINT.XL_ONLY]: `(min-width: ${BREAKPOINT_VALUE.XL}px) and (max-width: ${BREAKPOINT_VALUE.XXL - 0.02}px)`,
} as const;
