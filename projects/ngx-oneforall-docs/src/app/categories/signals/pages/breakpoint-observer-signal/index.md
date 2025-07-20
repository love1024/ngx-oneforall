



The `breakpointMatcher` signal is a reactive utility designed to simplify responsive design in Angular applications. It enables components to automatically detect and respond to changes in viewport size or device characteristics by leveraging Angular Signals. By using `breakpointMatcher`, you can declaratively track whether the current viewport matches a specific breakpoint or media query, allowing your UI to adapt seamlessly without manual event listeners or subscriptions.

### Single Breakpoint Matcher (Boolean Signal)

The `breakpointMatcher` function allows you to reactively track whether the current viewport matches a specific breakpoint or media query. It returns an Angular `Signal<boolean>`, which updates automatically as the viewport changes.

This approach is ideal when you only need to know if a single breakpoint is currently active, such as toggling a mobile navigation menu or adjusting layout for tablets.

```typescript
import { breakpointMatcher } from '@ngx-oneforall/signals';
import { Breakpoint } from '@ngx-oneforall/constants';

@Component({
    // ...
})
export class ExampleComponent {
    // Signal that is true if the viewport matches the 'md' breakpoint
    isMedium = breakpointMatcher(Breakpoint.MD);
}
```

The signal updates in real time, so your UI remains in sync with the viewport without manual event handling or subscriptions.

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("BreakpointMatcherSignalDemoComponent") }}

---

### Multiple Breakpoint Matcher (BreakpointResult Interface)

For more advanced scenarios, the `breakpointMatcherMultiple` function enables you to monitor several breakpoints or media queries at once. It returns a `Signal<BreakpointResult>`, which provides detailed information about which breakpoints are currently matched.

The `BreakpointResult` interface includes:
- `some`: `true` if at least one breakpoint matches
- `all`: `true` if all specified breakpoints match
- `breakpoints`: an object mapping each breakpoint to its match status (`true` or `false`)

```typescript
import { breakpointMatcherMultiple } from '@ngx-oneforall/signals';
import { Breakpoint } from '@ngx-oneforall/constants';

@Component({
    // ...
})
export class ExampleComponent {
    // Signal with match status for extra small or small screens
    breakpoints = breakpointMatcherMultiple([Breakpoint.XS, Breakpoint.SMOnly]);
}
```

This is especially useful for complex responsive layouts or when you need to coordinate multiple UI changes based on different viewport sizes.

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("BreakpointMatcherMultipleSignalDemoComponent") }}

---

### Breakpoints

The `@ngx-oneforall/constants` package provides a set of predefined breakpoint values that represent common device and viewport sizes (such as `sm`, `md`, `lg`, etc.). By using these constants, you ensure consistency across your application and avoid hardcoding media queries.

```typescript
import { Breakpoint } from '@ngx-oneforall/constants';

// Example usage
const breakpoint = Breakpoint.md; // Represents the 'medium' breakpoint
```

These breakpoints are mapped to standard CSS media queries, making it easy to reference them throughout your components and services.

Following is the list of breakpoints already declared in the library.

```typescript
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

### Providing Custom Media Queries

In addition to predefined breakpoints, you can supply custom CSS media queries directly to the matcher functions. This gives you full flexibility to target any device characteristic or viewport condition.

```typescript
@Component({
    // ...
})
export class CustomQueryComponent {
    // Signal that is true if the viewport is 600px wide or less
    isMobile = breakpointMatcher('(max-width: 600px)');
}
```

Custom queries are handled in the same reactive manner, ensuring your component state always reflects the current viewport.



