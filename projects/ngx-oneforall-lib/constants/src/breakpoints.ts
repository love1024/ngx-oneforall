export enum Breakpoint {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
  XXL = 'XXL',
  SMOnly = 'SMOnly',
  MDOnly = 'MDOnly',
  LGOnly = 'LGOnly',
  XLONly = 'XLONly',
}

export const BreakpointQueries = {
  [Breakpoint.XS]: '(width < 576px)',
  [Breakpoint.SM]: '(width >= 576px)',
  [Breakpoint.MD]: '(width >= 768px)',
  [Breakpoint.LG]: '(width >= 992px)',
  [Breakpoint.XL]: '(width >= 1200px)',
  [Breakpoint.XXL]: 'width >= 1400px)',
  [Breakpoint.SMOnly]: '(576px <= width < 768px)',
  [Breakpoint.MDOnly]: '(768px <= width < 992px)',
  [Breakpoint.LGOnly]: '(992px <= width < 1200px)',
  [Breakpoint.XLONly]: '(1200px <= width < 1400px)',
};
