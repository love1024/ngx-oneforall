The `uppercase` directive automatically transforms the input value to uppercase as the user types.

### Import

```typescript
import { UppercaseDirective } from 'ngx-oneforall/directives/uppercase';
```

### Usage

Add the `uppercase` attribute to any `input` or `textarea` element.

```html
<input type="text" uppercase />
```

### Features

- **Auto-transform**: Converts text to uppercase on input and blur events.
- **Model Update**: Updates the underlying `FormControl` or `ngModel` value if attached.
- **Paste Support**: Handles pasted content correctly.
- **Visual-Only Mode**: Use `[updateOutput]="false"` to transform visually via CSS but keep the original model value.

### Configuration

| Input | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `updateOutput` | `boolean` | `true` | If `true` (default), transforms the value and updates the model. If `false`, applies CSS `text-transform: uppercase` only. |

### Live Demonstration

{{ NgDocActions.demo("UppercaseDemoComponent") }}
