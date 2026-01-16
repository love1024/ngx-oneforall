![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/pipes/first-error-key&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `FirstErrorKeyPipe` extracts the first validation error key from a form control's errors. It supports optional priority ordering to control which error displays first.

### Installation

```ts
import { FirstErrorKeyPipe } from 'ngx-oneforall/pipes/first-error-key';
```

### Usage

```html file="./demo/snippets.html"#L4-L6
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `errors` | `ValidationErrors \| null` | Errors object from a form control |
| `priority` | `string[]` | Optional array of error keys in priority order |

### Priority Ordering

By default, returns the first error key in object order. With priority, returns the first matching priority key:

```html file="./demo/snippets.html"#L18-L22
```

**How it works:**
1. Iterates through priority array
2. Returns first key that exists in errors
3. Falls back to first available key if no matches

### Examples

#### Basic Usage

```html file="./demo/snippets.html"#L2-L7
```

{{ NgDocActions.demo("FirstErrorControlComponent") }}

#### With Error Messages

```html file="./demo/snippets.html"#L10-L13
```

{{ NgDocActions.demo("FirstErrorValidationComponent") }}

### Behavior

- Returns empty string `''` if no errors
- Pure pipe - re-runs when errors object reference changes
- Always use `control.errors` (not `control`) for reactive updates
