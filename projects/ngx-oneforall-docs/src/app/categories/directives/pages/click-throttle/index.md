

The `ClickThrottleDirective` is an Angular directive that throttles click events on the host element.

### Overview

This directive prevents excessive click event emissions by ensuring that only one click event is emitted within a specified time interval. It is useful for avoiding accidental double-clicks or rapid user interactions that could lead to unintended behavior, such as multiple form submissions or repeated API calls.

### Inputs

- **throttleTime: number**  
    The minimum time interval (in milliseconds) between consecutive click events. Defaults to `1000` ms (1 second). You can customize this value by binding to the directive:

    ```html
    <button [throttleTime]="500">Click Me</button>
    ```

### Outputs

- **clickThrottle: EventEmitter<Event>**  
    Emits the click event, but only once per throttle interval. Subscribe to this output to handle throttled click events:

    ```html
    <button [throttleTime]="1000" (clickThrottle)="onThrottledClick($event)">Click Me</button>
    ```

### Usage Example

```html
<button [throttleTime]="1500" (clickThrottle)="handleClick($event)">
    Throttled Button
</button>
```

### Implementation Details

- Utilizes RxJS's `throttleTime` operator to manage the throttling logic.
- Automatically cleans up event subscriptions when the directive is destroyed.
- Reacts to changes in the `throttleTime` input and updates the throttling behavior accordingly.

### Best Practices

- Use this directive on interactive elements where rapid repeated clicks should be ignored.
- Adjust the `throttleTime` input based on the desired user experience and the criticality of the action being throttled.

## Example Usage

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("ClickThrottleDemoComponent") }}
