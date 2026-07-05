![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/phone&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `phone` signal validator checks if the value of a Signal Form field is a valid phone number for a specific country. It uses `libphonenumber-js` for validation.

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `phone` validator.

## Usage

Use `phone` to ensure a field contains a valid phone number.


### Signal Forms

```typescript
import { phone } from 'ngx-oneforall/validators/signals/phone';
```

## API

```typescript
type PhoneFailureReason = 'invalid_format';

function phone(
  path: SchemaPath<string | null | undefined>,
  country: CountryCode,
  options?: { message?: string | Partial<Record<PhoneFailureReason, string>> }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `country`: The country code (e.g., `'US'`, `'GB'`) for which to validate the phone number.
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. You can pass a single `string` for all failure reasons, or a `Record` mapping specific failure reasons to their custom messages. If not provided for a specific reason, it defaults to the reason string itself (e.g., `'invalid_format'`).



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { phone } from 'ngx-oneforall/validators/signals/phone';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      phoneNumber
      <input [formField]="settingsForm.phoneNumber" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    phoneNumber: ''
  });

  settingsForm = form(this.settingsModel, (path) => {
    phone(path.phoneNumber, "US");
  });
}
```


## Demo

{{ NgDocActions.demo("PhoneSignalDemoComponent", { container: true }) }}
