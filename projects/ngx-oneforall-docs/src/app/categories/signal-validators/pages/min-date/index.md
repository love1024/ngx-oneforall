![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/min-date&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `minDate` signal validator checks if the value of a Signal Form field is a date that is on or after a minimum allowed date.

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `minDate` validator.

## Usage

Use `minDate` to validate that a date input is not before a certain date.


### Signal Forms

```typescript
import { minDate } from 'ngx-oneforall/validators/signals/min-date';
```

## API

```typescript
type MinDateFailureReason = 'date_before_min' | 'invalid_date' | 'unsupported_type';

function minDate(
  path: SchemaPath<Date | string | number | null | undefined>,
  min: Date | string | number,
  options?: { message?: string | Partial<Record<MinDateFailureReason, string>> }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `min`: The minimum allowed date. Can be a `Date` object, date string, or numeric timestamp.
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. You can pass a single `string` for all failure reasons, or a `Record` mapping specific failure reasons to their custom messages. If not provided for a specific reason, it defaults to the reason string itself (e.g., `'date_before_min'`).



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { minDate } from 'ngx-oneforall/validators/signals/min-date';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      deliveryDate
      <input [formField]="settingsForm.deliveryDate" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    deliveryDate: ''
  });

  settingsForm = form(this.settingsModel, (path) => {
    minDate(path.deliveryDate, new Date());
  });
}
```


## Demo

{{ NgDocActions.demo("MinDateSignalDemoComponent", { container: true }) }}
