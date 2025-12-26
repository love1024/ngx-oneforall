`breakpointMatcher` creates a reactive signal that tracks viewport size against media queries. It simplifies responsive design by providing real-time breakpoint matching with Angular signals.

## Usage

Use `breakpointMatcher` to reactively adapt your UI based on viewport size without manual event listeners.

{{ NgDocActions.demo("BreakpointMatcherSignalDemoComponent", { container: true }) }}

### Single Breakpoint

```typescript
import { breakpointMatcher } from '@ngx-oneforall/signals/breakpoint-matcher-signal';
import { BREAKPOINT } from '@ngx-oneforall/constants';

@Component({ ... })
export class ResponsiveComponent {
    // True when viewport matches 'md' breakpoint
    isMedium = breakpointMatcher(BREAKPOINT.MD);
    
    // Or use a custom media query
    isMobile = breakpointMatcher('(max-width: 600px)');
}
```

### Multiple Breakpoints

For checking multiple breakpoints at once, use `breakpointMatcherMultiple`:

{{ NgDocActions.demo("BreakpointMatcherMultipleSignalDemoComponent", { container: true }) }}

```typescript
import { breakpointMatcherMultiple } from '@ngx-oneforall/signals/breakpoint-matcher-signal';
import { BREAKPOINT } from '@ngx-oneforall/constants';

@Component({ ... })
export class LayoutComponent {
    breakpoints = breakpointMatcherMultiple([
        BREAKPOINT.XS, 
        BREAKPOINT.SM_ONLY
    ]);
    
    // Access results
    // breakpoints().some  - true if at least one matches
    // breakpoints().all   - true if all match
    // breakpoints().breakpoints[BREAKPOINT.XS]  - individual status
}
```

## API

### breakpointMatcher

`breakpointMatcher(query: string | BREAKPOINT): Signal<boolean>`

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `string \| BREAKPOINT` | Media query or predefined breakpoint |

Returns a signal that is `true` when the viewport matches.

### breakpointMatcherMultiple

`breakpointMatcherMultiple(queries: (string | BREAKPOINT)[]): Signal<BreakpointResult>`

| Property | Type | Description |
|----------|------|-------------|
| `some` | `boolean` | True if at least one breakpoint matches |
| `all` | `boolean` | True if all breakpoints match |
| `breakpoints` | `Record<string, boolean>` | Individual match status |

## Predefined Breakpoints

The `@ngx-oneforall/constants` package provides standard breakpoints:

| Breakpoint | Media Query |
|------------|-------------|
| `XS` | `(width < 576px)` |
| `SM` | `(width >= 576px)` |
| `MD` | `(width >= 768px)` |
| `LG` | `(width >= 992px)` |
| `XL` | `(width >= 1200px)` |
| `XXL` | `(width >= 1400px)` |
| `SM_ONLY` | `(576px <= width < 768px)` |
| `MD_ONLY` | `(768px <= width < 992px)` |
| `LG_ONLY` | `(992px <= width < 1200px)` |
| `XL_ONLY` | `(1200px <= width < 1400px)` |

## When to Use

✅ **Good use cases:**
- Responsive navigation menus
- Conditional component loading
- Layout switching (grid/list)
- Touch vs mouse interactions

❌ **Avoid when:**
- CSS media queries are sufficient
- You only need container queries
