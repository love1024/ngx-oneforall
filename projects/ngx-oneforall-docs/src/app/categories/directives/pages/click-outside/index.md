

The **ClickOutside** directive in Angular enables your application to detect and respond to user clicks that occur outside a specific element. This is essential for building interactive UI components such as dropdowns, modals, tooltips, and popovers, where you often need to close or hide the component when the user clicks elsewhere on the page.

## Features

- **Global Click Detection:** Monitors click events on the entire document and identifies clicks outside the host element.
- **Flexible Handling:** Lets you bind custom logic or handler functions to respond when an outside click is detected.
- **Easy Integration:** Attach the directive to any Angular element using a straightforward attribute selector.
- **Optimized Performance:** Manages event listeners efficiently to reduce overhead and avoid memory leaks.

## How to Use

To use the **ClickOutside** directive, import and simply add the directive's selector (e.g., `clickOutside`) to your element and bind it to a handler function in your component:

```html
<div (clickOutside)="onClickedOutside($event)">
  <!-- Content here -->
</div>
```

In your component:

```typescript
onClickedOutside(event: Event): void {
  // Handle the outside click event
}
```

## Disabling the Directive

You can temporarily disable the **ClickOutside** directive by binding the `[clickOutsideEnabled]` input to a boolean value. When set to `false`, the directive will not emit outside click events.

```html
<div
  (clickOutside)="onClickedOutside($event)"
  [clickOutsideEnabled]="isEnabled"
>
  <!-- Content here -->
</div>
```

Set `isEnabled` to `false` in your component to disable the directive:

```typescript
isEnabled = false;
```

## Example Usage

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("ClickOutsideDemoComponent") }}
