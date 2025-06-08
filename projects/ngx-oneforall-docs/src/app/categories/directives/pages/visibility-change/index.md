

The `VisibilityChangeDirective` is an Angular structural directive designed to detect and respond to changes in the visibility of an element within the viewport or a specified scrollable container. It leverages the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to efficiently monitor when an element enters or leaves the visible area, enabling developers to trigger actions based on visibility changes.


## Example Usage

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("VisibilityChangeDemoComponent") }}


## Use Cases

This directive is perfect for:
- Animating elements as they appear within the viewport
- Implementing infinite scrolling for lists or feeds
- Managing virtual scroll by adding or removing DOM elements based on visibility
- Adjusting or removing items that are only partially visible in a container
- Loading content on demand as it becomes visible

And many other scenarios!

## Features

- **Reactive Visibility Detection:** Emits events when the host element becomes visible or hidden.
- **Customizable Threshold:** Configure the percentage of the element's visibility required to trigger events.
- **Flexible Root Container:** Observe visibility within the viewport or a custom scrollable container.
- **Type-Safe Events:** Emits a strongly-typed `VisibilityChange` event with relevant details.

## Directive API

### Selector

```typescript
[visibilityChange]
```

### Inputs

| Name       | Type                      | Description                                                      |
|------------|---------------------------|------------------------------------------------------------------|
| `threshold`| `number`                  | The percentage (0.0–1.0) of the element's visibility required to trigger the event. Default is `1.0` (fully visible). |
| `root`     | `HTMLElement \| null`     | The element used as the viewport for checking visibility. Defaults to the browser viewport if `null`. |

### Outputs

| Name                | Type                | Description                                      |
|---------------------|---------------------|--------------------------------------------------|
| `visibilityChange`  | `VisibilityChange`  | Emits an event when the element's visibility changes. |


## Usage

Apply the directive to any element you want to observe. Bind to the `visibilityChange` output to react to visibility changes.

```html
<div
    [visibilityChange]
    [threshold]="0.5"
    [root]="scrollContainer"
    (visibilityChange)="onVisibilityChange($event)">
    Content to observe
</div>
```

```typescript
onVisibilityChange(event: VisibilityChange) {
    if (event.isVisible) {
        // Element is now visible
    } else {
        // Element is now hidden
    }
}
```



