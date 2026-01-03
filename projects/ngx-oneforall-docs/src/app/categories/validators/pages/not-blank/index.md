![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/not-blank&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`notBlank` is a validator that ensures the control's value is not blank (empty or whitespace-only).

## Usage

Use `notBlank` to validate that input values contain actual content, not just whitespace. Unlike `Validators.required`, this validator fails for strings containing only spaces, tabs, or newlines.

{{ NgDocActions.demo("NotBlankDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl, Validators } from '@angular/forms';
import { notBlank } from 'ngx-oneforall/validators/not-blank';

// Use alone - allows null/undefined
const control = new FormControl(null, notBlank);

// Combine with required for mandatory non-blank field
const requiredControl = new FormControl(null, [Validators.required, notBlank]);
```

### Template-Driven Forms (Directive)

You can use the `[notBlank]` directive with template-driven forms.

```html
<input type="text" [(ngModel)]="name" notBlank>
```

## API

`notBlank: ValidatorFn`

>**Note** Unlike other validators that are functions, `notBlank` is a pre-created `ValidatorFn` constant since it requires no configuration.

### Error Object

When validation fails, returns:

```typescript
{ notBlank: true }
```

### Behavior

| Value | Result |
|-------|--------|
| `null` / `undefined` | Valid (allows composition with `required`) |
| `''` (empty string) | Invalid |
| `'   '` (whitespace only) | Invalid |
| `'\t\n'` (tabs/newlines) | Invalid |
| `'hello'` | Valid |
| `'  hello  '` | Valid |
| Non-string values | Valid |
