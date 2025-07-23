

The `NetworkStatusService` monitors and provides the current network connectivity status in an Angular application. It leverages the browser's `navigator.onLine` property and listens to `online` and `offline` events to determine the network status in real-time. The service offers both reactive and signal-based APIs for accessing the network status.

#### Features
- Detects whether the application is online or offline.
- Provides reactive streams (`isOnline$`) for observing network status changes.
- Offers signal-based APIs (`isOnlineSignal`) for Angular's signal-based reactivity.
- Automatically updates the network status when the browser's connectivity changes.

#### Usage
1. Import and provide the `NetworkStatusService` in your Angular module or component.
2. Inject the service into your component or service to access its properties and methods.

#### Example
```typescript
...
import { NetworkStatusService } from './network-status.service';

@Component({
    ...
    template: `
        @if(isOnline()) {
            <p>You are online</p>
        } @else {
            <p>You are offline</p> 
        }
    `
})
export class NetworkStatusComponent {
  isOnline = computed(() => this.networkStatuService.isOnlineSignal());
  private readonly networkStatuService = inject(NetworkStatusService);
}
```

#### Properties
- **`isOnline`**: A boolean getter that returns `true` if the application is online, otherwise `false`.
- **`isOffline`**: A boolean getter that returns `true` if the application is offline, otherwise `false`.
- **`isOnline$`**: An observable stream that emits the current network status (`true` for online, `false` for offline).
- **`isOnlineSignal`**: A readonly signal that reflects the current network status.

#### Notes
- This service assumes it is running in a browser environment where the `window` object is available.

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("LoggerServiceDemoComponent") }}

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("LoggerServiceCustomDemoComponent") }}