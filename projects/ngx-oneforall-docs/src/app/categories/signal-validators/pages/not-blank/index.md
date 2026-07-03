![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/not-blank&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `notBlank` signal validator checks if the value of a Signal Form field is not blank (empty or whitespace-only).

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `not-blank` validator.

### Signal Forms

```typescript
import { notBlank } from 'ngx-oneforall/validators/signals/not-blank';
```

## API

```typescript
function notBlank(
  path: SchemaPath<string | null | undefined>,
  options?: { message?: string }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. If not provided, it defaults to the reason string `'notBlank'`.

## Usage

Use `notBlank` to validate that input values contain actual content, not just whitespace. Unlike `Validators.required`, this validator fails for strings containing only spaces, tabs, or newlines.

{{ NgDocActions.demo("NotBlankSignalDemoComponent", { container: true }) }}
