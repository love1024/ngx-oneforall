`maxDate` is a validator that ensures the control's value is a date less than or equal to a specified maximum date.

## Usage

Use `maxDate` to validate that a date is not after a certain boundary.

>**Note** This validator internally uses the `date` validator to first ensure the inputs are valid date structures.

{{ NgDocActions.demo("MaxDateDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { maxDate } from '@ngx-oneforall/validators/max-date';

const control = new FormControl(null, maxDate(new Date('2025-12-31')));
// OR with string
const control = new FormControl(null, maxDate('2025-12-31'));
// OR with timestamp
const control = new FormControl(null, maxDate(1735689600000));
```

### Template-Driven Forms (Directive)

You can use the `[maxDate]` directive. It accepts a `Date` object, date string, or numeric timestamp.

```html
<input type="date" [(ngModel)]="value" [maxDate]="maxDateValue">
```

## API

`maxDate(max: Date | string | number): ValidatorFn`

Returns `{ maxDate: { reason: 'date_exceeds_max', requiredDate, actualValue } }` if validation fails, or `null` if valid.

