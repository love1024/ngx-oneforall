![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/range-length&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `rangeLength` signal validator checks if the length of a Signal Form field's value is within a specified range (inclusive).

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `rangeLength` validator.

## Usage

Use `rangeLength` to ensure a string or array has a length between a given minimum and maximum.


### Signal Forms

```typescript
import { rangeLength } from 'ngx-oneforall/validators/signals/range-length';
```

## API

```typescript
type RangeLengthFailureReason = 'length_out_of_range';

function rangeLength(
  path: SchemaPath<string | any[] | null | undefined>,
  min: number,
  max: number,
  options?: { message?: string | Partial<Record<RangeLengthFailureReason, string>> }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `min`: The minimum allowed length (inclusive).
- `max`: The maximum allowed length (inclusive).
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. You can pass a single `string` for all failure reasons, or a `Record` mapping specific failure reasons to their custom messages. If not provided for a specific reason, it defaults to the reason string itself (e.g., `'length_out_of_range'`).



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { rangeLength } from 'ngx-oneforall/validators/signals/range-length';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      username
      <input [formField]="settingsForm.username" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    username: ''
  });

  settingsForm = form(this.settingsModel, (path) => {
    rangeLength(path.username, 3, 15);
  });
}
```


## Demo

{{ NgDocActions.demo("RangeLengthSignalDemoComponent", { container: true }) }}
