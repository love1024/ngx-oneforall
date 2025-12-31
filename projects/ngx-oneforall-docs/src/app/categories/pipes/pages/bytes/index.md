![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/pipes/bytes&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `BytesPipe` converts a number (in bytes) into a human-readable string with appropriate units (B, KB, MB, GB, TB, PB). It automatically selects the best unit and formats the number with configurable decimal places.

### Usage

```html file="./snippets.html"#L2-L4
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number \| string` | — | The bytes value to format |
| `decimals` | `number` | `2` | Decimal places in output |
| `units` | `string[] \| null` | `['B', 'KB', ...]` | Custom unit labels |
| `useSI` | `boolean` | `false` | Use SI base (1000) instead of binary (1024) |

### Binary vs SI Units

By default, the pipe uses **binary** base (1024):
- 1 KB = 1024 bytes
- 1 MB = 1,048,576 bytes

With `useSI: true`, use **SI** base (1000):
- 1 KB = 1000 bytes
- 1 MB = 1,000,000 bytes

```html file="./snippets.html"#L22-L24
```

### Examples

#### Custom Decimals

```html file="./snippets.html"#L8-L10
```

#### Custom Units

```html file="./snippets.html"#L18-L18
```

#### Large Numbers

```html file="./snippets.html"#L14-L14
```

### Edge Cases

- Handles negative numbers: `-1024` → `-1.00 KB`
- Returns `0 B` for invalid values (`NaN`, `null`, `undefined`, empty string)
- Caps at largest unit for very large numbers

---

#### Live Demo

{{ NgDocActions.demo("BytesPipeDemoComponent") }}
