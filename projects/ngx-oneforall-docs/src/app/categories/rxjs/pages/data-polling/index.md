`dataPolling` is an RxJS operator that automatically polls a data source at specified intervals.

It uses `timer` and `switchMap` to repeatedly call a loader function, making it perfect for real-time data updates.

## Usage

{{ NgDocActions.demo("DataPollingDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { Subject } from 'rxjs';
import { dataPolling } from '@ngx-oneforall/rxjs/data-polling';

const trigger = new Subject<void>();

trigger.pipe(
    dataPolling({
        loader: () => fetchData(), // Your data fetching function
        interval: 5 // Poll every 5 seconds
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
import { dataPolling } from '@ngx-oneforall/rxjs/data-polling';

export class MyComponent {
    constructor(private http: HttpClient) {}

    startPolling() {
        const trigger = new Subject<void>();
        
        trigger.pipe(
            dataPolling({
                loader: () => this.http.get('/api/status'),
                interval: 10 // Poll every 10 seconds
            })
        ).subscribe(status => {
            console.log('Server status:', status);
        });

        trigger.next();
    }
}
```

## API

`dataPolling<T>(config: { loader: () => Observable<T>; interval: number }): OperatorFunction<any, T>`

### Parameters

- **loader**: A function that returns an Observable of the data to poll
- **interval**: Polling interval in seconds

### Behavior

- Immediately calls the loader when the source emits
- Continues polling at the specified interval
- Cancels previous polling if the source emits again
- The interval is specified in **seconds**, not milliseconds
