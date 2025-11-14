## TruncatePipe

The `TruncatePipe` is a custom Angular pipe that shortens long strings to a specified character limit. It can optionally preserve whole words and append a customizable ellipsis or suffix. This is useful for displaying previews or summaries of longer text content in user interfaces, such as article snippets, titles, or descriptions where space is limited.

### Usage

Apply the pipe in Angular templates:

```html file="./snippets.html"#L1-L1
```

- **longText**: The string to be truncated.
- **limit** (optional): Maximum number of characters to retain. Defaults to `100`.
- **completeWords** (optional): If `true`, truncation will not cut words in half; instead, it trims to the last full word within the limit. Defaults to `false`.
- **ellipsis** (optional): String to append to the truncated text. Defaults to `'…'`.

### Parameters

- `value: string | null | undefined`  
    The input string to be truncated. If `null` or `undefined`, an empty string is returned.
- `limit: number`  
    Maximum number of characters to display before truncation. If less than or equal to zero, only the ellipsis is returned.
- `completeWords: boolean`  
    If `true`, ensures truncation does not split words. Trims to the last space within the limit.
- `ellipsis: string`  
    String appended to the end of the truncated text. Defaults to the Unicode ellipsis character.

### Behavior

- If the input string is shorter than or equal to the specified limit, it is returned unchanged.
- If `completeWords` is enabled and the truncation point falls in the middle of a word, the pipe trims back to the last full word.
- If no complete word fits within the limit, only the ellipsis is returned.
- The pipe is marked as `pure`, so it only recalculates when its inputs change.

### Example

```html file="./snippets.html"#L3-L3
```

> See the [Angular Pipes Guide](https://angular.io/guide/pipes) for more information.

---

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("TruncatePipeDemoComponent") }}
