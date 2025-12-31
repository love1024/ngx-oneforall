![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/range-length&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`rangeLength` is a validator that requires the length of the value (string, array, or number digits) to be within a specified range.

## Usage

Use `rangeLength` to validate form controls where the input size matters, such as usernames, passwords, or list selections.

{{ NgDocActions.demo("RangeLengthDemoComponent", { container: true }) }}

### Example

```typescript
import { FormControl } from '@angular/forms';
import { rangeLength } from 'ngx-oneforall/validators/range-length';

const control = new FormControl('', rangeLength(5, 10));
```

### Directive Usage

You can also use `[rangeLength]` directive with template-driven forms:

```html
<input [(ngModel)]="value" [rangeLength]="[5, 10]">
```

## API

`rangeLength(min: number, max: number): ValidatorFn`

- **min**: Minimum required length.
- **max**: Maximum allowed length.

Returns `{ rangeLength: { reason: 'length_out_of_range', requiredMinLength, requiredMaxLength, actualLength } }` if validation fails, or `null` if valid.

Throws an error if `min` is greater than `max`.

