export const BREAKPOINT = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl',

  SM_ONLY: 'smOnly',
  MD_ONLY: 'mdOnly',
  LG_ONLY: 'lgOnly',
  XL_ONLY: 'xlOnly',
} as const;

export const BREAKPOINT_VALUE = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
} as const;

export type Breakpoint = (typeof BREAKPOINT)[keyof typeof BREAKPOINT];

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
