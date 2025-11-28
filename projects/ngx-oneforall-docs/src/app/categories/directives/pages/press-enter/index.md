
The **PressEnter** directive allows you to listen for the 'Enter' key press event on any element. This is particularly useful for input fields where you want to trigger an action when the user presses Enter, such as submitting a form or adding an item to a list.

## Features

- **Enter Key Detection:** Specifically listens for the `keydown.enter` event.
- **Prevent Default:** Automatically prevents the default behavior of the Enter key (e.g., form submission).
- **Easy Integration:** Simply add the `pressEnter` attribute to any element.

## How to Use

To use the **PressEnter** directive, import it and add the `pressEnter` selector to your element. Bind to the `(pressEnter)` output to handle the event.

```html
<input 
  type="text" 
  (pressEnter)="onEnter()"
/>
```

In your component:

```typescript
onEnter(): void {
  console.log('Enter key pressed!');
}
```

## Configuration

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `preventDefault` | `boolean` | `true` | Whether to prevent the default behavior of the Enter key. |

## Example Usage

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("PressEnterDemoComponent") }}
