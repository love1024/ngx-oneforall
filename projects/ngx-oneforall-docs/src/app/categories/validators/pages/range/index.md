`range` is a validator that requires the control's value to be within a specified numerical range (inclusive).

## Usage

Use `range` to validate numeric inputs against a minimum and maximum value.

{{ NgDocActions.demo("RangeDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { range } from '@ngx-oneforall/validators';

const control = new FormControl(null, range(5, 10));
```

### Template-Driven Forms (Directive)

You can use the `[range]` directive with template-driven forms. It accepts a tuple `[min, max]`.

```html
<input type="number" [(ngModel)]="value" [range]="[5, 10]">
```

## API

`range(min: number, max: number): ValidatorFn`

- **min**: The minimum required value.
- **max**: The maximum required value.

Returns a validation error object `{ range: { min, max, actualValue } }` if validation fails, or `null` if valid.
