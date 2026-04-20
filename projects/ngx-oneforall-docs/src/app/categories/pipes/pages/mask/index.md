![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/pipes/mask&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `MaskPipe` formats a raw string or number by applying a mask pattern. It uses the same masking engine as the `MaskDirective`, making it ideal for displaying pre-formatted values in templates without needing an input element.

> **Note** For interactive input masking (with cursor management, validation, and form integration), use the `MaskDirective` instead.

---

## Installation

```typescript
import { MaskPipe } from 'ngx-oneforall/pipes/mask';
```

---

## Usage

```html file="./snippets.html"#L2-L5
```

---

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string \| number \| null \| undefined` | — | The raw value to mask |
| `mask` | `string` | — | The mask pattern to apply |
| `config` | `MaskConfig` | `{}` | Optional configuration object |

### MaskConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `prefix` | `string` | `''` | Text to prepend to the masked output |
| `suffix` | `string` | `''` | Text to append to the masked output |
| `customPatterns` | `Record<string, IConfigPattern>` | `{}` | Custom patterns to extend or override built-ins |
| `specialCharacters` | `string[]` | `['-', '/', '(', ')', '.', ':', ' ', '+', ',', '@', '[', ']', '"', "'"]` | Characters treated as separators in the mask |
| `mergeSpecialChars` | `boolean` | `false` | Merge custom special characters with defaults |
| `removeSpecialCharacters` | `boolean` | `true` | Remove special characters from the raw output |

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

## Examples

### Prefix & Suffix

```html file="./snippets.html"#L8-L11
```

### Custom Patterns

```html file="./snippets.html"#L14-L17
```

### Optional Quantifier

```html file="./snippets.html"#L20-L23
```

---

## Demo

{{ NgDocActions.demo("MaskPipeDemoComponent") }}
