![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/credit-card&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `creditCard` signal validator checks if the value of a Signal Form field is a valid credit card number.

It uses the Luhn algorithm to verify the checksum, checks for standard PAN lengths (13, 15, 16, 19), and validates that 15-digit cards are valid American Express cards (starting with 34 or 37).

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `credit-card` validator.



### Signal Forms

```typescript
import { creditCard } from 'ngx-oneforall/validators/signals/credit-card';
```

## API

```typescript
type CreditCardFailureReason =
  | 'repeated_digits'
  | 'invalid_length'
  | 'invalid_amex_prefix'
  | 'luhn_failed';

function creditCard(
  path: SchemaPath<string | number | null | undefined>,
  options?: { message?: string | Partial<Record<CreditCardFailureReason, string>> }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. You can pass a single `string` for all failure reasons, or a `Record` mapping specific failure reasons to their custom messages. If not provided for a specific reason, it defaults to the reason string itself (e.g., `'invalid_length'`, `'luhn_failed'`).


## Usage

Use `creditCard` to validate credit card inputs.

{{ NgDocActions.demo("CreditCardSignalDemoComponent", { container: true }) }}
