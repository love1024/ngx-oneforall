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

Returns a validation error object with a reason code if validation fails, or `null` if valid.

### Error Codes

| Reason | Description |
|--------|-------------|
| `repeated_digits` | All digits are identical (e.g., `0000000000000000`) |
| `invalid_length` | PAN length is not 13, 15, 16, or 19 digits |
| `invalid_amex_prefix` | 15-digit card doesn't start with 34 or 37 |
| `luhn_failed` | Luhn algorithm checksum failed |

```typescript
// Example error object
{ creditCard: { reason: 'luhn_failed' } }
{ creditCard: { reason: 'invalid_length', actualLength: 12 } }
```
