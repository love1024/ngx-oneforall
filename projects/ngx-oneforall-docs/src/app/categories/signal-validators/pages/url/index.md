![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/url&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `url` signal validator checks if the value of a Signal Form field is a valid URL. It strictly validates absolute URLs by default, but can allow missing protocols via options.

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `url` validator.

## Usage

Use `url` to ensure a field contains a properly formatted web address.


### Signal Forms

```typescript
import { url } from 'ngx-oneforall/validators/signals/url';
```

## API

```typescript
type UrlFailureReason = 'unsupported_type' | 'invalid_protocol' | 'invalid_format';

interface UrlSignalValidatorOptions {
  protocols?: readonly string[];
  skipProtocol?: boolean;
  message?: string | Partial<Record<UrlFailureReason, string>>;
}

function url(
  path: SchemaPath<string | null | undefined>,
  options?: UrlSignalValidatorOptions
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `options` (optional): Configuration object.
  - `protocols`: List of allowed protocols (e.g., `['http', 'https']`). If provided, validates protocol matches.
  - `skipProtocol`: If `true`, allows keys like `google.com` to be valid by tentatively prepending `http://`.
  - `message`: Custom error message to return when validation fails. You can pass a single `string` for all failure reasons, or a `Record` mapping specific failure reasons to their custom messages. If not provided for a specific reason, it defaults to the reason string itself (e.g., `'invalid_format'`).



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { url } from 'ngx-oneforall/validators/signals/url';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      website
      <input [formField]="settingsForm.website" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    website: ''
  });

  settingsForm = form(this.settingsModel, (path) => {
    url(path.website);
  });
}
```


## Demo

{{ NgDocActions.demo("UrlSignalDemoComponent", { container: true }) }}
