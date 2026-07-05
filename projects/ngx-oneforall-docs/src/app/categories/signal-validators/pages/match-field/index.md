![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/signals/match-field&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `matchFields` signal validator checks if two child fields of a group/object have matching values.

>**Note** This is specifically designed for Angular 22+ Signal Forms (`@angular/forms/signals`). For Reactive Forms or Template-Driven Forms, please refer to the standard `matchFields` validator.

## Usage

Use `matchFields` to validate that two fields, such as "password" and "confirm password", have the exact same value. In Signal Forms, you apply this validator to the parent path of the two fields you wish to compare.


### Signal Forms

```typescript
import { matchFields } from 'ngx-oneforall/validators/signals/match-field';
```

## API

```typescript
function matchFields<T extends Record<string, any>>(
  path: SchemaPath<T, any>,
  field1: Extract<keyof T, string>,
  field2: Extract<keyof T, string>,
  options?: { message?: string }
): void;
```

### Parameters

- `path`: The `SchemaPath` to the parent object in the Signal Form to apply the validation to.
- `field1`: The property name of the first field.
- `field2`: The property name of the second field.
- `options` (optional): Configuration object.
  - `message`: Custom error message to return when validation fails. If not provided, it defaults to the reason string `'matchFields'`.



```typescript
import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { matchFields } from 'ngx-oneforall/validators/signals/match-field';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      Password
      <input type="password" [formField]="settingsForm.password" />
    </label>
    <label>
      Confirm Password
      <input type="password" [formField]="settingsForm.confirmPassword" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    password: "", 
    confirmPassword: ""
  });

  settingsForm = form(this.settingsModel, (path) => {
    matchFields(path, "password", "confirmPassword");
  });
}
```


## Demo

{{ NgDocActions.demo("MatchFieldSignalDemoComponent", { container: true }) }}
