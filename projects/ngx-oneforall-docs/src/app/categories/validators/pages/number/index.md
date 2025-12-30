`number` is a validator that ensures the control's value is a valid finite number or a string representation of a valid finite number.

## Usage

Use `number` to validate that input values are strictly numeric.

{{ NgDocActions.demo("NumberDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { number } from 'ngx-oneforall/validators/number';

const control = new FormControl(null, number);
```

### Template-Driven Forms (Directive)

You can use the `number` attribute directive (or `[number]`) with template-driven forms.

```html
<input type="text" [(ngModel)]="value" number>
```

## API

`number: ValidatorFn`

Returns a validation error object `{ number: { actualValue } }` if validation fails, or `null` if valid.
