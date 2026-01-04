![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/min-length-trimmed&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`minLengthTrimmed` is a validator that trims whitespace before checking minimum length.

## Usage

Unlike Angular's built-in `Validators.minLength`, this validator trims the value first, preventing whitespace-only strings from passing validation.

{{ NgDocActions.demo("MinLengthTrimmedDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { minLengthTrimmed } from 'ngx-oneforall/validators/min-length-trimmed';

const control = new FormControl('', minLengthTrimmed(3));

control.setValue('  ab  '); // invalid - trimmed length is 2
control.setValue('abc');    // valid - length is 3
```

### Template-Driven Forms (Directive)

```html
<input type="text" [(ngModel)]="username" [minLengthTrimmed]="3">
```

## API

`minLengthTrimmed(minLength: number): ValidatorFn`

### Error Object

When validation fails, returns:

```typescript
{
  minLengthTrimmed: {
    requiredLength: number,
    actualLength: number
  }
}
```

### Behavior

| Value | Min Length | Result |
|-------|------------|--------|
| `null` / `undefined` | any | Valid |
| `'ab'` | 3 | Invalid (length: 2) |
| `'  ab  '` | 3 | Invalid (trimmed length: 2) |
| `'abc'` | 3 | Valid |
| `'  abc  '` | 3 | Valid (trimmed length: 3) |
| `'   '` | 1 | Invalid (trimmed length: 0) |
