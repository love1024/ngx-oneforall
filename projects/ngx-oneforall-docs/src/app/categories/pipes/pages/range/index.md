The `RangePipe` generates an array of numbers within a specified range. It is primarily used with `@for` to iterate a specific number of times or over a sequence of numbers.

### Usage

Apply the pipe in Angular templates:

```html file="./snippets.html"#L1-L5
```

- **start**: The starting value (or end value if only one argument is provided).
- **end** (optional): The ending value (exclusive).
- **step** (optional): The increment/decrement step. Defaults to `1`.

### Parameters

- `start: number`
    The starting value of the sequence. If `end` is not provided, this is treated as the `end` value, and the sequence starts from `0`.
- `end: number` (optional)
    The ending value of the sequence (exclusive).
- `step: number` (optional)
    The value to increment or decrement by. Defaults to `1`. The step is always treated as positive; the direction is determined by the relationship between `start` and `end`.

### Examples

#### Start and End

```html file="./snippets.html"#L7-L11
```

#### With Step

```html file="./snippets.html"#L13-L17
```

#### Decreasing Range

```html file="./snippets.html"#L19-L23
```

### Behavior

- **Single Argument**: `5 | range` → `[0, 1, 2, 3, 4]`
- **Two Arguments**: `1 | range: 5` → `[1, 2, 3, 4]`
- **Step**: `0 | range: 10 : 2` → `[0, 2, 4, 6, 8]`
- **Decreasing**: `5 | range: 1` → `[5, 4, 3, 2]`
- **Safety**: The `step` is normalized to be positive (`Math.abs(step)`) to prevent infinite loops. If `step` is `0`, it defaults to `1`.
- The pipe is marked as `pure` and `standalone`.

---

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("RangePipeDemoComponent") }}
