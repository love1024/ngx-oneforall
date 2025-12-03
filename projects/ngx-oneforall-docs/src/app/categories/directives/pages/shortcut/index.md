
The **Shortcut** directive allows you to define keyboard shortcuts and trigger actions when the specified key combination is pressed. It supports modifier keys like `Ctrl`, `Shift`, `Alt`, and `Meta` (Cmd).

## Features

- **Custom Shortcuts:** Define any key combination (e.g., `ctrl.s`, `shift.enter`).
- **Modifier Support:** Supports `ctrl`, `shift`, `alt`, and `meta` (cmd) modifiers.
- **Global & Scoped:** Listen globally (window) or scoped to the element.
- **Prevent Default:** Automatically prevents the default behavior of the key combination.

## How to Use

To use the **Shortcut** directive, import it and add the `shortcut` attribute to any element. Pass the shortcut string as the value and bind to the `(action)` output.

```html
<!-- Element Scoped (default) -->
<input shortcut="ctrl.s" (action)="onSave()" />

<!-- Global Shortcut -->
<div shortcut="ctrl.s" [isGlobal]="true" (action)="onSave()"></div>
```

## Configuration

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `shortcut` | `string` | **Required** | The keyboard shortcut(s) to listen for. <br><br> **Format:** <br> - Single: `modifier.key` (e.g., `ctrl.s`, `ctrl.shift.s`) <br> - Multiple: Comma-separated (e.g., `ctrl.s, meta.s`) <br><br> **Supported Modifiers:** <br> `shift`, `control` (ctrl), `alt`, `meta` (cmd), `altleft`, `backspace`, `tab`, `left`, `right`, `up`, `down`, `enter`, `space`, `escape` (esc). |
| `isGlobal` | `boolean` | `false` | If `true`, listens for shortcuts globally on the window. If `false`, listens only when the element is focused. |

## Example Usage

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("ShortcutDemoComponent") }}
