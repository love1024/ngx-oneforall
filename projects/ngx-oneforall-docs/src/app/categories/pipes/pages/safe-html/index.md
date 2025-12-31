![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/pipes/safe-html&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `SafeHtmlPipe` bypasses Angular's HTML sanitization to render trusted HTML content.

> **⚠️ Security Warning** Only use with trusted content. User input must be sanitized server-side.

### Usage

```html
<div [innerHTML]="htmlContent | safeHtml"></div>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `string \| null` | The HTML string to trust |

### When to Use

- **CMS content** - Admin-generated HTML from a trusted CMS
- **Markdown output** - Pre-rendered markdown that's already sanitized
- **Static HTML** - Hardcoded HTML strings in your codebase

### When NOT to Use

- **User input** - Never use with unsanitized user-provided content
- **External APIs** - Content from untrusted third-party sources
- **Query parameters** - URL parameters or form inputs

### Behavior

- Returns `SafeHtml` for valid strings
- Returns empty `SafeHtml` for `null`/`undefined`
- Throws error for non-string values

### How it Works

Uses Angular's `DomSanitizer.bypassSecurityTrustHtml()` to mark content as trusted. This bypasses XSS protection, so ensure content is safe before use.

---

#### Live Demo

{{ NgDocActions.demo("SafeHtmlPipeDemoComponent") }}