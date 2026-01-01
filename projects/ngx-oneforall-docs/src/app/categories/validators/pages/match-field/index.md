![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/validators/match-field&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`matchFields` is a **group-level validator** that checks if two fields have matching values. Commonly used for "confirm password" or "confirm email" fields.

{{ NgDocActions.demo("MatchFieldDemoComponent", { container: true }) }}

## Usage

Applied at the **FormGroup level** so it detects changes to both fields:

```typescript
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { matchFields } from 'ngx-oneforall/validators/match-field';

const form = new FormGroup({
  password: new FormControl('', Validators.required),
  confirmPassword: new FormControl('', Validators.required)
}, { validators: matchFields('password', 'confirmPassword') });
```

## API

`matchFields(field1: string, field2: string): ValidatorFn`

| Parameter | Type | Description |
|-----------|------|-------------|
| `field1` | `string` | Name of the first control to compare |
| `field2` | `string` | Name of the second control to compare |

### Error Object

When validation fails, returns error on the **FormGroup** (not individual controls):
```typescript
{
  matchFields: {
    field1: 'password',
    field1Value: 'test123',
    field2: 'confirmPassword',
    field2Value: 'different'
  }
}
```

## Template Example

```html
<form [formGroup]="form">
  <input formControlName="password" type="password" placeholder="Password">
  <input formControlName="confirmPassword" type="password" placeholder="Confirm Password">
  
  @if (form.hasError('matchFields')) {
    <span class="error">Passwords do not match</span>
  }
</form>
```

## Template-Driven Forms (Directive)

Use the `matchFields` directive with an array of field names:

```html
<form ngForm [matchFields]="['password', 'confirmPassword']">
  <input type="password" name="password" ngModel />
  <input type="password" name="confirmPassword" ngModel />
  
  @if (form.hasError('matchFields')) {
    <span class="error">Passwords do not match</span>
  }
</form>
```

```typescript
import { MatchFieldsValidator } from 'ngx-oneforall/validators/match-field';

@Component({
  imports: [FormsModule, MatchFieldsValidator],
})
```
