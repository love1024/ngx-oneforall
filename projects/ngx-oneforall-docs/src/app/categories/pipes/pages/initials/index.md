![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/pipes/initials&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `initials` pipe transforms a name or string into its initials. It handles single or multiple words and allows customizing the number of initials returned.

### Installation

```ts
import { InitialsPipe } from 'ngx-oneforall/pipes/initials';
```

### Usage

```html file="./snippets.html"#L2-L3
```

### Examples

#### Basic Usage

```html file="./snippets.html"#L2-L3
```

#### Single Name

```html file="./snippets.html"#L6-L7
```

#### Custom Limit (1 Initial)

```html file="./snippets.html"#L10-L11
```

#### Custom Limit (3 Initials)

```html file="./snippets.html"#L14-L15
```

### Parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | The input string to transform |
| `count` | `number` | `2` | The maximum number of initials to return |

### Live Demo

{{ NgDocActions.demo("InitialsDemoComponent") }}
