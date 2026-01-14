![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/directives/mask&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

Apply input masks to format user input as they type.

## Features

- **Pattern-based masking** — Define mask patterns using simple characters
- **Quantifiers** — Use `?` (optional) and `*` (zero or more) for flexible patterns
- **Auto-insert separators** — Automatically adds separators like `-`, `/`, `(`, `)`
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
<input [mask]="'(000) 000-0000'" />

<!-- Date -->
<input [mask]="'00/00/0000'" />

<!-- Credit card -->
<input [mask]="'0000 0000 0000 0000'" />
```

---

## Pattern Characters

| Pattern | Description | Example |
|---------|-------------|---------|
| `0` | Required digit (0-9) | `000` → "123" |
| `A` | Required alphanumeric | `AAA` → "A1B" |
| `S` | Required letter (a-z, A-Z) | `SSS` → "ABC" |
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
<input [mask]="'0?0?0.0?0?0.0?0?0.0?0?0'" />

<!-- License plate: "ABC-1234" or "AB-1234" -->
<input [mask]="'SS?S?-0000'" />
```

**Zero or more (`*`):**
```html
<!-- Email: "user@domain.com" -->
<input [mask]="'A*@A*.A*'" />

<!-- Hashtag: "#a", "#hello", "#Angular" -->
<input [mask]="'#S*'" />
```

---

## API Reference

| Input | Type | Description |
|-------|------|-------------|
| `mask` | `string` | The mask pattern to apply |

---

## Demo

{{ NgDocActions.demoPane("MaskDemoComponent") }}
