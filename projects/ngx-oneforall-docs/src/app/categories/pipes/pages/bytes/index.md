The `BytesPipe` converts a number (in bytes) into a human-readable string with appropriate units (B, KB, MB, GB, TB, PB). It automatically selects the best unit and formats the number with a specified number of decimal places.

### Usage

Apply the pipe in Angular templates:

```html file="./snippets.html"#L1-L3
```

- **value**: The number of bytes to format.
- **decimals** (optional): The number of decimal places to include. Defaults to `2`.
- **units** (optional): Custom array of units. Defaults to `['B', 'KB', 'MB', 'GB', 'TB', 'PB']`.

### Parameters

- `value: number | string`
    The numeric value in bytes to be formatted. If the value is not a valid number, it returns "0 B".
- `decimals: number` (optional)
    The number of digits to appear after the decimal point. Defaults to `2`.
- `units: string[]` (optional)
    An array of strings representing the units to be used. Defaults to `['B', 'KB', 'MB', 'GB', 'TB', 'PB']`.

### Examples

#### Custom Decimals

```html file="./snippets.html"#L6-L7
```

#### Custom Units

```html file="./snippets.html"#L13-L13
```

#### Large Numbers

```html file="./snippets.html"#L10-L10
```

### Behavior

- Automatically scales from Bytes up to Petabytes (PB).
- Handles negative numbers correctly (e.g., `-1024` → `-1.00 KB`).
- Returns `0 B` for `NaN`, `null`, `undefined`, or empty strings.
- The pipe is marked as `pure` and `standalone`.

---

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("BytesPipeDemoComponent") }}
