![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/rxjs/data-polling&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`dataPolling` is an RxJS operator that automatically polls a data source at specified intervals.

It uses `timer` and `switchMap` to repeatedly call a loader function, making it perfect for real-time data updates.

## Usage

{{ NgDocActions.demo("DataPollingDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { Subject } from 'rxjs';
import { dataPolling } from 'ngx-oneforall/rxjs/data-polling';

const trigger = new Subject<void>();

trigger.pipe(
    dataPolling({
        loader: () => fetchData(), // Your data fetching function
        interval: 5000 // Poll every 5 seconds
    })
).subscribe(data => {
    console.log('Received data:', data);
});

// Start polling
trigger.next();
```

### With HTTP Requests

```typescript
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { dataPolling } from 'ngx-oneforall/rxjs/data-polling';

export class MyComponent {
    constructor(private http: HttpClient) {}

    startPolling() {
        const trigger = new Subject<void>();
        
        trigger.pipe(
            dataPolling({
                loader: () => this.http.get('/api/status'),
                interval: 10000 // Poll every 10 seconds
            })
        ).subscribe(status => {
            console.log('Server status:', status);
        });

        trigger.next();
    }
}
```

## API

`dataPolling<T>(config: DataPollingConfig<T>): OperatorFunction<unknown, T>`

### Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loader` | `() => Observable<T>` | - | Function that returns an Observable of the data to poll |
| `interval` | `number` | - | Polling interval in milliseconds |
| `retryCount` | `number` | `0` | Number of retry attempts on error |
| `retryDelay` | `number` | `1000` | Delay between retries in milliseconds |

### Behavior

- Immediately calls the loader when the source emits
- Continues polling at the specified interval
- Cancels previous polling if the source emits again
- Retries failed requests up to `retryCount` times with `retryDelay` between attempts

### Example with Retry

```typescript
trigger.pipe(
    dataPolling({
        loader: () => this.http.get('/api/data'),
        interval: 5000,
        retryCount: 3,  // Retry up to 3 times
        retryDelay: 1000 // Wait 1 second between retries
    })
).subscribe(data => console.log(data));
```

