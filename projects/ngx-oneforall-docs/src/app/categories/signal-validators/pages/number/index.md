![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/number&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `number` signal validator checks if the value of a Signal Form field is a valid number. It accepts numeric values and numeric strings.

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `number` validator.

## Usage

Use `number` to ensure the input evaluates to a valid numeric value.


### Signal Forms

```typescript
import { number } from 'ngx-oneforall/validators/signals/number';
```

## API

```typescript
function number(
  path: SchemaPath<string | number | null | undefined>,
  options?: { message?: string }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. Defaults to `'number'`.



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { number } from 'ngx-oneforall/validators/signals/number';

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
    number(path.age);
  });
}
```


## Demo

{{ NgDocActions.demo("NumberSignalDemoComponent", { container: true }) }}
