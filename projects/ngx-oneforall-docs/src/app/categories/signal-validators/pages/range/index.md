![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/range&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `range` signal validator checks if the value of a Signal Form field is within a specified numeric range (inclusive).

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `range` validator.

## Usage

Use `range` to ensure a field contains a numeric value between a given minimum and maximum.


### Signal Forms

```typescript
import { range } from 'ngx-oneforall/validators/signals/range';
```

## API

```typescript
type RangeFailureReason = 'out_of_range';

function range(
  path: SchemaPath<string | number | null | undefined>,
  min: number,
  max: number,
  options?: { message?: string | Partial<Record<RangeFailureReason, string>> }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `min`: The minimum allowed value (inclusive).
- `max`: The maximum allowed value (inclusive).
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. You can pass a single `string` for all failure reasons, or a `Record` mapping specific failure reasons to their custom messages. If not provided for a specific reason, it defaults to the reason string itself (e.g., `'out_of_range'`).



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { range } from 'ngx-oneforall/validators/signals/range';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      age
      <input [formField]="settingsForm.age" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    age: ''
  });

  settingsForm = form(this.settingsModel, (path) => {
    range(path.age, 18, 99);
  });
}
```


## Demo

{{ NgDocActions.demo("RangeSignalDemoComponent", { container: true }) }}
