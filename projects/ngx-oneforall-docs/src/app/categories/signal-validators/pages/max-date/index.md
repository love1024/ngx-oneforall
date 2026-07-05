![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/max-date&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `maxDate` signal validator checks if the value of a Signal Form field is a date that is before or equal to a maximum allowed date.

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `maxDate` validator.

## Usage

Use `maxDate` to validate that a date input does not exceed a certain date.


### Signal Forms

```typescript
import { maxDate } from 'ngx-oneforall/validators/signals/max-date';
```

## API

```typescript
type MaxDateFailureReason = 'date_exceeds_max' | 'invalid_date' | 'unsupported_type';

function maxDate(
  path: SchemaPath<Date | string | number | null | undefined>,
  max: Date | string | number,
  options?: { message?: string | Partial<Record<MaxDateFailureReason, string>> }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `max`: The maximum allowed date. Can be a `Date` object, date string, or numeric timestamp.
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. You can pass a single `string` for all failure reasons, or a `Record` mapping specific failure reasons to their custom messages. If not provided for a specific reason, it defaults to the reason string itself (e.g., `'date_exceeds_max'`).



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { maxDate } from 'ngx-oneforall/validators/signals/max-date';

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
    maxDate(path.deliveryDate, new Date());
  });
}
```


## Demo

{{ NgDocActions.demo("MaxDateSignalDemoComponent", { container: true }) }}
