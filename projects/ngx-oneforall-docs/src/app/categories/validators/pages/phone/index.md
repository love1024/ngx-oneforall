`phone` is a validator that checks if the control's value is a valid phone number for a specified country code.

It uses `libphonenumber-js` under the hood to validate phone numbers.

> **Warning** : This validator depends on `libphonenumber-js`, which is 145kb in size. Using this validator will increase your bundle size. Proceed with caution if bundle size is a critical constraint.

## Usage

Use `phone` to validate phone numbers. You must provide a `CountryCode` (Alpha-2 code).

{{ NgDocActions.demo("PhoneDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { phoneValidator } from '@ngx-oneforall/validators';
import { CountryCode } from '@ngx-oneforall/constants';

const control = new FormControl(null, phoneValidator(CountryCode.UnitedStates));
```

### Template-Driven Forms (Directive)

You can use the `[phone]` attribute directive.

```html
<input type="text" [(ngModel)]="value" [phone]="'US'">
<!-- Or use the CountryCode enum -->
<input type="text" [(ngModel)]="value" [phone]="CountryCode.UnitedStates">
```

## API

`phoneValidator(country: CountryCode): ValidatorFn`

Returns a validation error object `{ phone: true }` if validation fails, or `null` if valid.
