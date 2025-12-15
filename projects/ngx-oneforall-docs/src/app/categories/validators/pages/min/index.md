`min` is a validator that requires the control's value to be greater than or equal to a specified minimum number.

## Usage

Use `min` to validate numeric inputs where a minimum threshold is required.

{{ NgDocActions.demo("MinDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { min } from '@ngx-oneforall/validators';

const control = new FormControl(null, min(5));
```

### Template-Driven Forms (Directive)

You can use the `[min]` directive with template-driven forms.

```html
<input type="number" [(ngModel)]="value" [min]="5">
```

## API

`min(min: number): ValidatorFn`

- **min**: The minimum required value.

Returns a validation error object `{ min: { requiredValue, actualValue } }` if validation fails, or `null` if valid.
