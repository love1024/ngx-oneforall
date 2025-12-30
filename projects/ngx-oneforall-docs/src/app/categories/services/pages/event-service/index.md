A lightweight pub-sub service for event-based communication between Angular components and services.

## Features

- **Dispatch Events** — Publish custom events with optional typed payloads
- **Type-Safe Subscriptions** — Use generics for typed event data
- **Decoupled Communication** — No direct component references needed
- **SSR Safe** — Works in server-side rendering environments

---

## Installation

```typescript
import { EventService, provideEventService, AppEvent } from 'ngx-oneforall/services/event';
```

---

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService, provideEventService } from 'ngx-oneforall/services/event';

@Component({
  selector: 'app-demo',
  template: `
    <button (click)="sendEvent()">Send Event</button>
    @if (lastEvent) {
      <p>Last: {{ lastEvent.name }}</p>
    }
  `,
  providers: [provideEventService()],
})
export class DemoComponent {
  private events = inject(EventService);
  lastEvent?: { name: string; data?: unknown };

  constructor() {
    this.events.getEventEmitter()
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.lastEvent = event);
  }

  sendEvent() {
    this.events.dispatchEvent('myEvent', { foo: 'bar' });
  }
}
```

---

## Type-Safe Events

Use generics to get typed event data:

```typescript
interface UserData {
  userId: string;
  name: string;
}

// Typed subscription
this.events.getEventEmitter<UserData>().subscribe(event => {
  console.log(event.data?.userId);  // ✅ typed as string
  console.log(event.data?.name);    // ✅ typed as string
});

// Dispatch with matching type
this.events.dispatchEvent('user:login', { userId: '123', name: 'John' });
```

---

## API Reference

| Method | Returns | Description |
|--------|---------|-------------|
| `dispatchEvent(name, data?)` | `void` | Dispatches an event with name and optional data |
| `getEventEmitter<T>()` | `Observable<AppEvent<T>>` | Returns typed observable stream of events |

---

## Types

```typescript
interface AppEvent<T = unknown> {
  name: string;
  data?: T;
}
```

---

## When to Use

- Cross-component communication without parent-child relationship
- Decoupling event producers from consumers
- Broadcasting state changes to multiple subscribers

---

## Live Demo

{{ NgDocActions.demo("EventServiceDemoComponent") }}
