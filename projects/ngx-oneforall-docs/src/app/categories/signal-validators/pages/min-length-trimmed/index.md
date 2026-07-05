![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/min-length-trimmed&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `minLengthTrimmed` signal validator checks if the trimmed value of a Signal Form field meets a minimum length requirement. Unlike the built-in `minLength` validator, this ignores leading and trailing whitespaces.

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `minLengthTrimmed` validator.

## Usage

Use `minLengthTrimmed` to validate minimum character counts excluding whitespaces.


### Signal Forms

```typescript
import { minLengthTrimmed } from 'ngx-oneforall/validators/signals/min-length-trimmed';
```

## API

```typescript
function minLengthTrimmed(
  path: SchemaPath<string | null | undefined>,
  minLength: number,
  options?: { message?: string }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the field in the Signal Form to apply the validation to.
- `minLength`: The minimum number of characters required after the value is trimmed.
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. Defaults to `'minLengthTrimmed'`.



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { minLengthTrimmed } from 'ngx-oneforall/validators/signals/min-length-trimmed';

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
    minLengthTrimmed(path.username, 5);
  });
}
```


## Demo

{{ NgDocActions.demo("MinLengthTrimmedSignalDemoComponent", { container: true }) }}
