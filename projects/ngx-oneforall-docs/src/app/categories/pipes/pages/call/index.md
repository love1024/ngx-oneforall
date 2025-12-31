![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/pipes/call&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `CallPipe` invokes a function directly from the template with pure pipe caching. This prevents unnecessary change detection cycles since the function is only re-evaluated when its reference or arguments change.

### Usage

```html file="./snippets.html"#L2-L2
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `fn` | `Function` | The function to call |
| `...args` | `unknown[]` | Arguments to pass to the function |

### Why Use CallPipe?

Without the pipe, functions in templates are called on every change detection:

```html
<!-- ❌ Called on every CD cycle -->
{% raw %}{{ formatDate(date) }}{% endraw %}

<!-- ✅ Called only when date changes -->
{% raw %}{{ formatDate | call:date }}{% endraw %}
```

### Preserving Context

When using methods that rely on `this`, ensure the context is preserved:

#### Arrow Functions (Recommended)

Arrow functions automatically capture `this`:

```html file="./snippets.html"#L6-L6
```

#### Bound Methods

For regular methods, bind explicitly:

```typescript
// In component
getCounterBound = this.getCounter.bind(this);
```

```html file="./snippets.html"#L10-L10
```

### Behavior

- **Pure** - Only re-evaluates when function reference or arguments change
- **Type-safe** - Generic typing for better type inference
- **Null-safe** - Returns `null` if input is not a function

---

#### Live Demo

{{ NgDocActions.demo("CallPipeDemoComponent") }}
