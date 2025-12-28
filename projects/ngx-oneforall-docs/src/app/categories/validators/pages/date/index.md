`date` is a validator that ensures the control's value is a valid Date object or a string that can be successfully parsed into a Date.

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

`date(): ValidatorFn`

Returns a validation error object `{ date: { actualValue } }` if validation fails, or `null` if valid.
