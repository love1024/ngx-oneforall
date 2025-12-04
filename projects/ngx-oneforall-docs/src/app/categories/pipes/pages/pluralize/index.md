The `PluralizePipe` is a lightweight Angular pipe that handles word pluralization. It supports automatic pluralization for common English rules (s, es, ies) and allows custom plural forms. It can also optionally include the count in the output.

### Usage

Apply the pipe in Angular templates:

```html file="./snippets.html"#L1-L3
```

- **value**: The count (number) or string representation of a number.
- **singular**: The singular form of the word.
- **plural** (optional): Custom plural form. If omitted, the pipe attempts to auto-pluralize.
- **includeNumber** (optional): Whether to include the number in the output. Defaults to `true`.

### Parameters

- `value: number | string`
    The count to determine pluralization.
- `singular: string`
    The singular form of the word.
- `plural: string` (optional)
    The custom plural form. If not provided, the pipe applies standard English pluralization rules:
    - Ends with `s`, `x`, `z`, `ch`, `sh` → adds `es`
    - Ends with consonant + `y` → changes to `ies`
    - Otherwise → adds `s`
- `includeNumber: boolean` (optional)
    If `true`, returns "count word" (e.g., "2 apples"). If `false`, returns only the word (e.g., "apples"). Defaults to `true`.

### Examples

#### Custom Plural Form

```html file="./snippets.html"#L6-L6
```

#### Without Number

```html file="./snippets.html"#L9-L9
```

### Behavior

- If the count is `1`, the singular form is used.
- If the count is not `1` (including `0`), the plural form is used.
- The pipe is marked as `pure` and `standalone`.

---

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("PluralizePipeDemoComponent") }}
