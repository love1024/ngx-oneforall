The `TimeAgoPipe` displays relative time (e.g., "2 hours ago", "in 3 days"). Supports live updates, future dates, and customizable labels.

### Usage

```html file="./snippets.html"#L2-L2
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string \| Date` | — | Date to calculate time from |
| `live` | `boolean` | `true` | Enable automatic updates |

### Features

| Output | Description |
|--------|-------------|
| `just now` | Within 10 seconds |
| `X seconds ago` | Within 1 minute |
| `X minutes ago` | Within 1 hour |
| `X hours ago` | Within 1 day |
| `X days ago` | Within 1 week |
| `X weeks ago` | Within 1 month |
| `X months ago` | Within 1 year |
| `X years ago` | Over 1 year |
| `in X seconds` | Future within 1 minute |
| `in X days` | Future date |

### Examples

#### Basic Usage

{{ NgDocActions.demo("TimeAgoDemoComponent") }}

#### Disable Live Updates

```html file="./snippets.html"#L5-L5
```

#### Future Dates

```html file="./snippets.html"#L8-L9
```

### Custom Labels

Use `provideTimeAgoPipeLabels` to customize:

```typescript
providers: [
  provideTimeAgoPipeLabels(() => ({
    prefix: '',
    suffix: 'ago',
    futurePrefix: 'in',
    futureSuffix: '',
    justNow: 'just now',
    second: 'sec',
    seconds: 'secs',
    // ... other labels
  })),
]
```

{{ NgDocActions.demo("TimeAgoCustomLabelsDemoComponent") }}

### Custom Clock

Control update frequency:

```typescript
providers: [
  provideTimeAgoPipeClock(() => timer(5000)), // Update every 5 seconds
]
```

{{ NgDocActions.demo("TimeAgoCustomClockDemoComponent") }}
