The `TruncatePipe` shortens strings to a specified length with optional word boundary and position support.

### Usage

```html file="./snippets.html"#L2-L2
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string \| null` | — | The string to truncate |
| `limit` | `number` | `100` | Maximum character length |
| `completeWords` | `boolean` | `false` | Truncate at word boundary (end only) |
| `ellipsis` | `string` | `'…'` | String to append/insert when truncated |
| `position` | `'start' \| 'middle' \| 'end'` | `'end'` | Where to truncate |

### Examples

#### End Truncation (default)

```html file="./snippets.html"#L5-L6
```

#### Start Truncation

```html file="./snippets.html"#L9-L10
```

#### Middle Truncation

```html file="./snippets.html"#L13-L14
```

#### Complete Words

```html file="./snippets.html"#L17-L18
```

### Behavior

| Position | Example (limit: 8) | Output |
|----------|-------------------|--------|
| `end` | `Hello World` | `Hello Wo…` |
| `start` | `Hello World` | `…lo World` |
| `middle` | `Hello World` | `Hell…rld` |

- `completeWords` only applies to end truncation
- Returns empty string for `null`/`undefined` or `limit <= 0`

---

#### Live Demo

{{ NgDocActions.demo("TruncatePipeDemoComponent") }}
