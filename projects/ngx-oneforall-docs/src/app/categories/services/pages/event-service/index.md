
The `EventService` enables event-based communication within an Angular application. It provides a simple API for dispatching and listening to custom events using RxJS observables. This service is useful for decoupling components and services by allowing them to react to events without direct references.

#### Features
- Dispatch custom events with optional payloads.
- Subscribe to an observable event stream.
- Decouples event producers and consumers for better modularity.

#### Usage
1. Import and provide the `EventService` in your Angular module or component.
2. Inject the service into your component or service to dispatch or listen for events.

#### Example
```typescript
import { Component, inject } from '@angular/core';
import { EventService } from './event.service';

@Component({
    ...
    template: `
        <button (click)="sendEvent()">Send Event</button>
        <div *ngIf="lastEvent">
            Last event: {{ lastEvent.name }} - {{ lastEvent.data }}
        </div>
    `
})
export class EventDemoComponent {
    private eventService = inject(EventService);
    lastEvent?: { name: string; data?: unknown };

    constructor() {
        this.eventService.getEventEmitter().subscribe(event => {
            this.lastEvent = event;
        });
    }

    sendEvent() {
        this.eventService.dispatchEvent('myEvent', { foo: 'bar' });
    }
}
```

#### Properties & Methods
- **`dispatchEvent(name: string, data?: unknown)`**: Dispatches an event with a name and optional data.
- **`getEventEmitter(): Observable<AppEvent>`**: Returns an observable stream of dispatched events.

#### Notes
- Events are broadcast to all subscribers of the event stream.
- Use event names to distinguish between different event types.

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("EventServiceDemoComponent") }}
