![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/pipes/highlight-search&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `HighlightSearchPipe` highlights search matches by wrapping them in customizable HTML tags. Supports optional CSS classes for styling.

### Usage

```html file="./snippets.html"#L2-L2
```

> **Note** Use `[innerHTML]` binding since this pipe returns HTML.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string \| null` | — | The text to search within |
| `search` | `string \| null` | — | The term to highlight |
| `tag` | `string` | `'mark'` | HTML tag to wrap matches |
| `cssClass` | `string` | — | Optional CSS class for wrapper |

### Examples

#### Basic Usage

```html file="./snippets.html"#L2-L3
```

#### Custom Tag

```html file="./snippets.html"#L6-L7
```

#### Custom CSS Class

```html file="./snippets.html"#L10-L14
```

#### Special Characters

The pipe escapes regex characters automatically:

```html file="./snippets.html"#L17-L18
```

### Behavior

- **Case insensitive** - Matches 'angular' in 'Angular'
- **Regex safe** - Escapes special characters (`$`, `+`, `?`, etc.)
- **Null safe** - Returns original value or empty string for null inputs

---

#### Live Demo

{{ NgDocActions.demo("HighlightSearchPipeDemoComponent") }}
