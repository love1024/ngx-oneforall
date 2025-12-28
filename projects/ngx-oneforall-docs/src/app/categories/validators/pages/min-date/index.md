`minDate` is a validator that ensures the control's value is a date greater than or equal to a specified minimum date.

## Usage

Use `minDate` to validate that a date is not before a certain boundary.

> [!NOTE]
> This validator internally uses the `date` validator to first ensure the inputs are valid date structures.

{{ NgDocActions.demo("MinDateDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { minDate } from '@ngx-oneforall/validators/min-date';

const control = new FormControl(null, minDate(new Date('2023-01-01')));
// OR with string
const control = new FormControl(null, minDate('2023-01-01'));
```

### Template-Driven Forms (Directive)

You can use the `[minDate]` directive. It accepts a `Date` object or a date string.

```html
<input type="date" [(ngModel)]="value" [minDate]="minDateValue">
```

## API

`minDate(min: Date | string): ValidatorFn`

Returns a validation error object `{ minDate: { requiredDate, actualValue } }` if validation fails, or `null` if valid.
