
The **InfiniteScroll** directive allows you to implement infinite scrolling behavior in your Angular application. It detects when the user scrolls near the bottom of a container or the window and emits an event to load more content.

## Features

- **Scroll Detection:** Detects when the user scrolls to the bottom of an element or the window.
- **Customizable Threshold:** Configure the distance from the bottom (margin) to trigger the event.
- **Window or Container:** Supports scrolling on the main window or a specific scrollable container.
- **Performance Optimized:** Uses `IntersectionObserver` for efficient scroll detection without attaching scroll event listeners.
- **Initial Check:** Optionally checks for intersection on initialization.
- **Disabled State:** Can be dynamically disabled/enabled.

## How to Use

To use the **InfiniteScroll** directive, import it and add the `infiniteScroll` selector to your element. Bind to the `(scrolled)` output to handle the load more logic.

### Window Scrolling

By default, the directive listens to window scroll events.

```html
<div 
  infiniteScroll 
  (scrolled)="onScroll()"
>
  <!-- List items -->
</div>
```

### Container Scrolling

To use a specific scrollable container, set `[useWindow]="false"` and provide the container selector via `[scrollContainer]`.

```html
<div 
  class="scroll-container" 
  infiniteScroll 
  [useWindow]="false"
  [scrollContainer]="'.scroll-container'"
  (scrolled)="onScroll()"
>
  <!-- List items -->
</div>
```

## Configuration

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `bottomMargin` | `number` | `20` | The distance in percentage from the bottom to trigger the scroll event. |
| `useWindow` | `boolean` | `true` | Whether to listen for scroll events on the window or a specific container. |
| `scrollContainer` | `string \| null` | `null` | The CSS selector for the scrollable container. Required if `useWindow` is `false`. |
| `disabled` | `boolean` | `false` | Whether the directive is disabled. |
| `checkOnInit` | `boolean` | `true` | Whether to check for intersection immediately on initialization. |

## Example Usage

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("InfiniteScrollDemoComponent") }}
