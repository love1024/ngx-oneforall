![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/rxjs/backoff-retry&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

The `backOffRetry` RxJS operator automatically retries failed observables with an exponential backoff strategy. It is essential for handling transient failures in network requests or unstable services.

## Features

- **Exponential Backoff** — Increases delay between retries exponentially
- **Customizable Strategy** — Configure max retries, initial delay, and multiplier base
- **Typed Configuration** — Full TypeScript support for configuration
- **Seamless Integration** — Works with any RxJS observable

## Installation

```typescript
import { backOffRetry } from 'ngx-oneforall/rxjs/backoff-retry';
```

## Quick Start

```typescript
this.http.get('/api/data').pipe(
  backOffRetry()
).subscribe();
```

## Configuration

The operator accepts an optional `BackoffRetryConfig` object:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `3` | Maximum number of retry attempts |
| `delay` | `number` | `1000` | Initial delay in milliseconds |
| `base` | `number` | `2` | Base for exponential calculation |
| `maxDelay` | `number` | - | Optional cap for maximum delay (in ms) |

### Custom Configuration

```typescript
this.http.get('/api/unstable').pipe(
  backOffRetry({
    count: 5,       // Retry 5 times
    delay: 500,     // Start with 500ms delay
    base: 1.5       // Increase delay by 1.5x each time
  })
).subscribe();
```

### With Max Delay Cap

Prevent delays from growing too large:

```typescript
this.http.get('/api/data').pipe(
  backOffRetry({
    count: 10,       // Many retries
    delay: 1000,     // Start at 1 second
    base: 2,         // Double each time
    maxDelay: 30000  // But never wait more than 30 seconds
  })
).subscribe();
// Delays: 1s, 2s, 4s, 8s, 16s, 30s, 30s, 30s, 30s, 30s
```

## How It Works

The delay for each retry is calculated using the formula:

`min(delay * Math.pow(base, retryCount - 1), maxDelay)`

For default values (`delay=1000`, `base=2`):
- **Retry 1**: 1000ms
- **Retry 2**: 2000ms
- **Retry 3**: 4000ms

## Examples

### Robust API Calls

Wrap your HTTP requests to automatically recover from temporary network glitches:

```typescript
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

this.http.get('/api/users').pipe(
  backOffRetry(),
  catchError(err => {
    console.error('All retries failed', err);
    return of([]); // Fallback value
  })
).subscribe();
```

### With Other Operators

Combine with other operators for advanced flows:

```typescript
this.source$.pipe(
  // Custom logic before retry
  tap({ error: () => console.log('Retrying...') }),
  backOffRetry({ count: 2 }),
  // Logic after all retries fail
  catchError(err => throwError(() => new Error('Service Unavailable')))
);
```

## Demo

See the operator in action with visualized retry attempts:

{{ NgDocActions.demo("BackoffRetryDemoComponent") }}
