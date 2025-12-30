`url` is a validator that ensures the control's value is a valid absolute URL string.

## Usage

Use `url` to validate that input values are valid URLs. It supports configuration for restricting protocols.

{{ NgDocActions.demo("UrlDemoComponent", { container: true }) }}

### Reactive Forms

```typescript
import { FormControl } from '@angular/forms';
import { url } from 'ngx-oneforall/validators/url';

const control = new FormControl(null, url({ protocols: ['https'] }));
```

### Template-Driven Forms (Directive)

You can use the `[url]` directive with template-driven forms. It accepts a `UrlValidatorOptions` object.

```html
<input type="text" [(ngModel)]="value" [url]="{ protocols: ['https'] }">
```

## API

`url(options: UrlValidatorOptions): ValidatorFn`

Options:
- `protocols?: readonly string[]`: List of allowed protocols (e.g., `['https', 'ftp']`). Only checked for absolute URLs.
- `skipProtocol?: boolean`: If `true`, allows URLs without a protocol scheme (e.g., `google.com`). Default `false`.

### Error Codes

| Reason | Description |
|--------|-------------|
| `invalid_format` | Value is not a valid URL |
| `invalid_protocol` | Protocol does not match allowed list |
| `unsupported_type` | Value is not a string |

