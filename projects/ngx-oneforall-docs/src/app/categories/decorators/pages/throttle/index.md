The `Throttle` decorator is a powerful utility in Angular that helps developers control the frequency of method execution. It is particularly useful in scenarios where frequent method calls, such as those triggered by events like `click`, `scroll`, or `resize`, can lead to performance issues. By limiting how often a method can be executed, the `Throttle` decorator ensures smoother application performance and prevents unnecessary computations.

## What is Throttling?

Throttling is a technique used to control the rate at which a function is executed. When a method is throttled, it is guaranteed to run at most once within a specified time interval, regardless of how many times it is triggered. This is especially beneficial in event-driven programming, where certain events can fire repeatedly in quick succession.

## How the `Throttle` Decorator Works

The `Throttle` decorator in Angular is implemented as a method decorator. When applied to a method, it wraps the method's execution logic with throttling behavior. This means that subsequent calls to the method within the defined delay period are ignored, ensuring that the method is executed only once per interval.

### Key Benefits:

- **Performance Optimization**: Reduces the overhead of handling frequent events.
- **Simplified Code**: Eliminates the need for manual throttling logic.
- **Improved User Experience**: Prevents lag or unresponsiveness caused by excessive method calls.

## Usage of the `Throttle` Decorator

To use the `Throttle` decorator, you need to import it from the `ngx-oneforall-lib` library and apply it to the desired method. The decorator accepts a single parameter, which specifies the delay interval in milliseconds.

### Example: Throttling a Click Event Handler

The following example demonstrates how to throttle a button click handler in an Angular component using the `Throttle` decorator:

```typescript
import { Component } from '@angular/core';
import { throttle } from 'ngx-oneforall-lib';

@Component({
  selector: 'app-example',
  template: `<button (click)="handleClick()">Click Me</button>`,
})
export class ExampleComponent {
  @throttle(500)
  handleClick() {
    console.log('Button clicked');
  }
}
```

#### Explanation:

1. The `@throttle(500)` decorator ensures that the `handleClick` method is executed at most once every 500 milliseconds.
2. If the `handleClick` method is called multiple times within the 500ms interval, only the first call is executed, and the rest are ignored.

This approach is particularly useful for scenarios like:

- Preventing multiple form submissions.
- Limiting API calls triggered by user interactions.
- Optimizing event listeners for high-frequency events like `scroll` or `mousemove`.

## Advanced Use Cases

The `Throttle` decorator can also be applied to methods handling other types of events, such as `scroll` or `resize`. For example:

```typescript
import { Component, HostListener } from '@angular/core';
import { throttle } from 'ngx-oneforall-lib';

@Component({
  selector: 'app-scroll-example',
  template: `<div class="scrollable-content">Scrollable Content</div>`,
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class ScrollExampleComponent {
  // This function will get called on scroll
  @throttle(300)
  onScroll() {
    console.log('Scroll event handled');
  }
}
```

In this example, the `onScroll` method is throttled to execute at most once every 300 milliseconds, ensuring efficient handling of scroll events.

## Live Demonstration

To see the `Throttle` decorator in action, check out the live demonstration below:

{{ NgDocActions.demo("ThrottleDemoComponent") }}

This demo showcases how the `Throttle` decorator can be used to optimize event handling and improve application performance.

## Conclusion

The `Throttle` decorator is a simple yet effective tool for managing method execution frequency in Angular applications. By applying it to methods that handle frequent events, you can significantly enhance the performance and responsiveness of your application. Whether you're dealing with user interactions or system-generated events, the `Throttle` decorator provides a clean and efficient solution for throttling method calls.
