![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/date&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `date` signal validator checks if the value of a Signal Form field is a valid date.
It supports `Date` objects, date strings, and numeric timestamps.

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `date` validator.

## Usage

Use `date` to validate date inputs.


### Signal Forms

```typescript
import { date } from 'ngx-oneforall/validators/signals/date';
```

## API

```typescript
type DateFailureReason = 'invalid_date' | 'unsupported_type';

function date(
  path: SchemaPath<Date | string | number | null | undefined>,
  options?: { message?: string | Partial<Record<DateFailureReason, string>> }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. You can pass a single `string` for all failure reasons, or a `Record` mapping specific failure reasons to their custom messages. If not provided for a specific reason, it defaults to the reason string itself (e.g., `'invalid_date'`).



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { date } from 'ngx-oneforall/validators/signals/date';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      birthDate
      <input [formField]="settingsForm.birthDate" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    birthDate: ''
  });

  settingsForm = form(this.settingsModel, (path) => {
    date(path.birthDate);
  });
}
```


## Demo

{{ NgDocActions.demo("DateSignalDemoComponent", { container: true }) }}
