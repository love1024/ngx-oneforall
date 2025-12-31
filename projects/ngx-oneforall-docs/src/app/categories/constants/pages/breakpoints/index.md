![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/constants&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `ngx-oneforall/constants` package provides a set of constants for responsive design breakpoints, including their names, numeric values, and CSS media query strings.

## Usage

Import the constants to handle responsive logic in your components or services.

```typescript
import { BREAKPOINT, BREAKPOINT_QUERY } from 'ngx-oneforall/constants';

// Example: Using a media query in a component
const isMobileQuery = BREAKPOINT_QUERY[BREAKPOINT.XS];

// Example: Comparing against a breakpoint value
if (window.innerWidth >= BREAKPOINT_VALUE.MD) {
  // Logic for tablet and above
}
```

## BREAKPOINT

The `BREAKPOINT` constant defines the names of the support breakpoints.

| Name | Value |
| :--- | :--- |
| **XS** | `'xs'` |
| **SM** | `'sm'` |
| **MD** | `'md'` |
| **LG** | `'lg'` |
| **XL** | `'xl'` |
| **XXL** | `'xxl'` |
| **SM_ONLY** | `'smOnly'` |
| **MD_ONLY** | `'mdOnly'` |
| **LG_ONLY** | `'lgOnly'` |
| **XL_ONLY** | `'xlOnly'` |

## BREAKPOINT_VALUE

Numeric pixel values for each breakpoint threshold.

| Name | Value (px) |
| :--- | :--- |
| **XS** | `0` |
| **SM** | `576` |
| **MD** | `768` |
| **LG** | `992` |
| **XL** | `1200` |
| **XXL** | `1400` |

## BREAKPOINT_QUERY

Standardized CSS media query strings for each breakpoint.

| Breakpoint | Media Query |
| :--- | :--- |
| **XS** | `(max-width: 575.98px)` |
| **SM** | `(min-width: 576px)` |
| **MD** | `(min-width: 768px)` |
| **LG** | `(min-width: 992px)` |
| **XL** | `(min-width: 1200px)` |
| **XXL** | `(min-width: 1400px)` |
| **SM_ONLY**| `(min-width: 576px) and (max-width: 767.98px)` |
| **MD_ONLY**| `(min-width: 768px) and (max-width: 991.98px)` |
| **LG_ONLY**| `(min-width: 992px) and (max-width: 1199.98px)` |
| **XL_ONLY**| `(min-width: 1200px) and (max-width: 1399.98px)` |
