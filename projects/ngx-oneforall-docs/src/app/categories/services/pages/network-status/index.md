Monitor browser network connectivity with reactive signals and observables.

## Features

- **Signal-Based** — `isOnlineSignal` for reactive templates
- **Observable-Based** — `isOnline$` for RxJS workflows  
- **Boolean Getters** — `isOnline` and `isOffline`
- **SSR Safe** — Safe checks for window availability
- **Auto Updates** — Listens to browser online/offline events

---

## Installation

```typescript
import { 
  NetworkStatusService, 
  provideNetworkStatusService 
} from '@ngx-oneforall/services/network-status';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { NetworkStatusService, provideNetworkStatusService } from '@ngx-oneforall/services/network-status';

@Component({
  selector: 'app-demo',
  template: `
    @if (network.isOnlineSignal()) {
      <span class="online">● Online</span>
    } @else {
      <span class="offline">● Offline</span>
    }
  `,
  providers: [provideNetworkStatusService()],
})
export class DemoComponent {
  network = inject(NetworkStatusService);
}
```

---

## API Reference

| Property | Type | Description |
|----------|------|-------------|
| `isOnline` | `boolean` | Current online status |
| `isOffline` | `boolean` | Current offline status |
| `isOnlineSignal` | `Signal<boolean>` | Reactive signal for templates |
| `isOnline$` | `Observable<boolean>` | Observable stream of status |

---

## Using with RxJS

```typescript
@Component({...})
export class DemoComponent {
  private network = inject(NetworkStatusService);

  constructor() {
    this.network.isOnline$.pipe(
      filter(online => !online),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.showOfflineToast();
    });
  }
}
```

---

## SSR Behavior

On server-side rendering:
- `isOnline` returns `true` (optimistic default)
- No event listeners are attached \

---

## Live Demo

{{ NgDocActions.demo("NetworkStatusDemoComponent") }}