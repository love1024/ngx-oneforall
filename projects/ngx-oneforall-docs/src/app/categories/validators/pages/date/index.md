`date` is a validator that ensures the control's value is a valid date. It supports `Date` objects, date strings, and numeric timestamps.

## Usage

Use `date` to validate date inputs.

{{ NgDocActions.demo("DateDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { date } from '@ngx-oneforall/validators/date';

const control = new FormControl(null, date);
```

### Template-Driven Forms (Directive)

You can use the `date` attribute directive (or `[date]`) with template-driven forms.

```html
<input type="text" [(ngModel)]="value" date>
```

## API

`date: ValidatorFn`

Returns a validation error object with a reason code if validation fails, or `null` if valid.

### Error Codes

| Reason | Description |
|--------|-------------|
| `invalid_date` | Value cannot be parsed as a valid date |
| `unsupported_type` | Value is not a string, number, or Date object |

```typescript
// Example error objects
{ date: { reason: 'invalid_date', actualValue: 'not a date' } }
{ date: { reason: 'unsupported_type', actualValue: true } }
```

