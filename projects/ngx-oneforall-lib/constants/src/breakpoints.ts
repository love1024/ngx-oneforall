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
  [Breakpoint.SMOnly]: '(width >= 576px and width < 768px)',
  [Breakpoint.MDOnly]: '(width >= 768px and width < 992px)',
  [Breakpoint.LGOnly]: '(width >= 992px and width < 1200px)',
  [Breakpoint.XLONly]: '(width >= 1200px and width < 1400px)',
};
