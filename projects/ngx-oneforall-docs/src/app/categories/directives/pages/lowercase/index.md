The `lowercase` directive automatically transforms the input value to lowercase as the user types.

### Import

```typescript
import { LowercaseDirective } from 'ngx-oneforall/directives/lowercase';
```

### Usage

Add the `lowercase` attribute to any `input` or `textarea` element.

```html
<input type="text" lowercase />
```

### Features

- **Auto-transform**: Converts text to lowercase on input and blur events.
- **Model Update**: Updates the underlying `FormControl` or `ngModel` value if attached.
- **Paste Support**: Handles pasted content correctly.
- **Visual-Only Mode**: Use `[updateOutput]="false"` to transform visually via CSS but keep the original model value.

### Configuration

| Input | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `updateOutput` | `boolean` | `true` | If `true` (default), transforms the value and updates the model. If `false`, applies CSS `text-transform: lowercase` only. |

### Live Demonstration

{{ NgDocActions.demo("LowercaseDemoComponent") }}
