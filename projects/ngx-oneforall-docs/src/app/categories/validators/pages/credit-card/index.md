`creditCard` is a validator that checks if the control's value is a valid credit card number using the Luhn algorithm.

It enforces specific PAN lengths (13, 15, 16, 19) and validates 15-digit cards as American Express (must start with 34 or 37). It also handles non-numeric characters (separators) by stripping them before validation.

## Usage

Use `creditCard` to validate credit card inputs.

{{ NgDocActions.demo("CreditCardDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { creditCard } from '@ngx-oneforall/validators/credit-card';

const control = new FormControl(null, creditCard);
```

### Template-Driven Forms (Directive)

You can use the `creditCard` attribute directive.

```html
<input type="text" [(ngModel)]="value" creditCard>
```

## API

`creditCard: ValidatorFn`

Returns a validation error object `{ creditCard: true }` if validation fails, or `null` if valid.
