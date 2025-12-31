![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/pipes/pluralize&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `PluralizePipe` handles word pluralization with automatic English rules and custom plural support.

### Usage

```html file="./snippets.html"#L2-L5
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number \| string` | — | The count to base pluralization on |
| `singular` | `string` | — | The singular form of the word |
| `plural` | `string \| null` | auto | Custom plural form (auto-generated if not provided) |
| `includeNumber` | `boolean` | `true` | Whether to prefix with the count |

### Auto-Pluralization Rules

When no custom plural is provided:
- Ends with `s`, `x`, `z`, `ch`, `sh` → adds `es` (box → boxes)
- Ends with consonant + `y` → changes to `ies` (city → cities)
- Otherwise → adds `s` (apple → apples)

### Examples

#### Custom Plural Form

```html file="./snippets.html"#L8-L9
```

#### Without Number

```html file="./snippets.html"#L12-L13
```

### Behavior

- Count `1` → singular form
- Count `0`, `2+`, decimals, negatives → plural form
- Throws error if singular form is empty

---

#### Live Demo

{{ NgDocActions.demo("PluralizePipeDemoComponent") }}
