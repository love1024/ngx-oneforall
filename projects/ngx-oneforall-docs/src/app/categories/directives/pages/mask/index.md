![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/mask&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Apply input masks to format user input as they type.

## Features

- **Pattern-based masking** — Define mask patterns using simple characters
- **Quantifiers** — Use `?` (optional) and `*` (zero or more) for flexible patterns
- **Auto-insert separators** — Automatically adds separators like `-`, `/`, `(`, `)`
- **Prefix & Suffix** — Add unmodifiable prefix and suffix strings
- **Form validation** — Implements Angular's `Validator` interface for reactive forms
- **SSR Safe** — Only runs in the browser

---

## Installation

```typescript
import { MaskDirective } from 'ngx-oneforall/directives/mask';
```

---

## Basic Usage

```html
<!-- Phone number -->
<input [mask]="'(###) ###-####'" />

<!-- Date -->
<input [mask]="'##/##/####'" />

<!-- Credit card -->
<input [mask]="'#### #### #### ####'" />
```

---

## Pattern Characters

| Pattern | Description | Example |
|---------|-------------|---------|
| `#` | Required digit (0-9) | `###` → "123" |
| `A` | Required alphanumeric | `AAA` → "A1B" |
| `@` | Required letter (a-z, A-Z) | `@@@` → "ABC" |
| `U` | Required uppercase letter | `UUU` → "ABC" |
| `L` | Required lowercase letter | `LLL` → "abc" |

---

## Quantifiers

| Quantifier | Description |
|------------|-------------|
| `?` | Makes the preceding pattern optional (0 or 1 match) |
| `*` | Matches zero or more of the preceding pattern |

### Practical Examples

**Optional (`?`):**
```html
<!-- IP address (1-3 digits per octet) -->
<input [mask]="'#?#?#.#?#?#.#?#?#.#?#?#'" />

<!-- License plate: "ABC-1234" or "AB-1234" -->
<input [mask]="'@@?@?-####'" />
```

**Zero or more (`*`):**
```html
<!-- Email: "user@domain.com" -->
<input [mask]="'A*\@A*.A*'" />

<!-- Hashtag: "#a", "#hello", "#Angular" -->
<input [mask]="'\#@*'" />
```

---

## API Reference

| Input | Type | Description |
|-------|------|-------------|
| `mask` | `string` | The mask pattern to apply |
| `prefix` | `string` | Text to prepend to the masked value |
| `suffix` | `string` | Text to append to the masked value |
| `customPatterns` | `Record<string, IConfigPattern>` | Custom patterns to extend or override built-in patterns |
| `clearIfNotMatch` | `boolean` | If `true`, clears the input on blur when mask is incomplete (default: `false`) |

### IConfigPattern Interface

```typescript
interface IConfigPattern {
  pattern: RegExp;     // The regex pattern to match
  optional?: boolean;  // If true, equivalent to ? quantifier
}
```

---

## Custom Patterns

Define your own pattern characters or override built-in ones:

```html
<!-- Custom hex digit pattern -->
<input 
  [mask]="'XX-XX-XX'" 
  [customPatterns]="{ X: { pattern: /[0-9A-Fa-f]/ } }" />

<!-- Time input with hour validation (0-2 for first digit) -->
<input 
  [mask]="'H#:M#'" 
  [customPatterns]="{
    H: { pattern: /[0-2]/ },
    M: { pattern: /[0-5]/ }
  }" />

<!-- Optional pattern via property -->
<input 
  [mask]="'O##'" 
  [customPatterns]="{ O: { pattern: /\\d/, optional: true } }" />
```

---

## Validation

The directive implements Angular's `Validator` interface. When used with reactive forms, it returns a `mask` error if the input is incomplete:

```typescript
// Error object when input is incomplete
{
  mask: {
    requiredMask: '(###) ###-####',  // The mask pattern
    actualValue: '(123'               // Current masked value
  }
}
```

```html
<input [formControl]="phone" [mask]="'(###) ###-####'" />
@if (phone.errors?.['mask']) {
  <span class="error">
    Incomplete: {{ phone.errors['mask'].actualValue }}
  </span>
}
```

---

## Demo

{{ NgDocActions.demoPane("MaskDemoComponent") }}

