The `Breakpoint` enum defines a set of named breakpoints commonly used in responsive web design, such as `XS`, `SM`, `MD`, `LG`, `XL`, and `XXL`, along with range-specific values like `SMOnly` and `MDOnly`. These enums help standardize breakpoint references throughout your codebase.

The accompanying `BreakpointQueries` object maps each breakpoint to its corresponding CSS media query string, making it easy to use these breakpoints for conditional rendering or styling in your application.

```typescript
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
```
