![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/pipes/range&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `RangePipe` generates an array of numbers in a range. Follows Python's `range()` convention.

### Installation

```ts
import { RangePipe } from 'ngx-oneforall/pipes/range';
```

### Usage

```html file="./snippets.html"#L2-L5
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `start` | `number` | — | Start value (or end if `end` not provided) |
| `end` | `number` | — | End value (exclusive) |
| `step` | `number` | `1` | Step increment (direction auto-detected) |

### Examples

#### Start and End

```html file="./snippets.html"#L8-L11
```

#### With Step

```html file="./snippets.html"#L14-L17
```

#### Decreasing Range

```html file="./snippets.html"#L20-L23
```

### Behavior

| Input | Output |
|-------|--------|
| `5 \| range` | `[0, 1, 2, 3, 4]` |
| `1 \| range:5` | `[1, 2, 3, 4]` |
| `0 \| range:10:2` | `[0, 2, 4, 6, 8]` |
| `5 \| range:1` | `[5, 4, 3, 2]` |

- Step is normalized to positive (`Math.abs(step)`)
- Zero step defaults to 1 to prevent infinite loops
- Direction determined by comparing start and end

---

#### Live Demo

{{ NgDocActions.demo("RangePipeDemoComponent") }}
