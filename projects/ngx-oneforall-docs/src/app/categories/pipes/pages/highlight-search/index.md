The `HighlightSearchPipe` highlights occurrences of a search term within a text string by wrapping them in `<mark>` tags.

### Usage

Apply the pipe in Angular templates using `[innerHTML]`:

```html file="./snippets.html"#L1-L2
```

> [!IMPORTANT]
> Because this pipe returns an HTML string containing `<mark>` tags, you must bind it to `[innerHTML]`. Angular's default sanitization will ensure safety, but be aware that you are injecting HTML.

- **value**: The text to search within.
- **search**: The term to highlight.

### Parameters

- `value: string | null | undefined`
    The source text.
- `search: string | null | undefined`
    The term to find and highlight. The search is case-insensitive.

### Examples

#### Basic Usage

```html file="./snippets.html"#L1-L2
```

#### Case Insensitive

```html file="./snippets.html"#L5-L6
```

#### Special Characters

The pipe automatically escapes special regex characters in the search term.

```html file="./snippets.html"#L9-L10
```

### Behavior

- **Case Insensitive**: Matches 'angular' in 'Angular'.
- **Regex Safety**: Automatically escapes special characters (e.g., `$`, `+`, `?`) in the search term.
- **Null Handling**: Returns the original value (or empty string) if inputs are null/undefined.
- The pipe is marked as `pure` and `standalone`.

---

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("HighlightSearchPipeDemoComponent") }}
