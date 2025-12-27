import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '@ngx-oneforall/services/event';

enum AppEvents {
  IncreaseCount = 'INCREASE_COUNT',
}

@Component({
  selector: 'lib-event-service-demo',
  template: `
    <section>
      <h2>Event Service Demo</h2>
      <p>
        This demo showcases two sibling components communicating via a shared
        event service.
      </p>
      <div class="event-demo-container">
        <div class="event-demo-box">
          <h3>Component 1</h3>
          <button (click)="increaseCount()">Increase Count</button>
        </div>
        <div class="event-demo-box">
          <h3>Component 2</h3>
          <p>
            Current Count: <strong>{{ count() }}</strong>
          </p>
        </div>
      </div>
    </section>
  `,
  styleUrl: 'event-service-demo.component.scss',
  providers: [EventService],
})
export class EventServiceDemoComponent {
  count = signal(0);
  private eventService = inject(EventService);

  constructor() {
    this.listenToEvents();
  }

  increaseCount() {
    this.eventService.dispatchEvent(AppEvents.IncreaseCount);
  }

  private listenToEvents() {
    this.eventService
      .getEventEmitter()
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        if (event.name === AppEvents.IncreaseCount) {
          this.count.update(c => c + 1);
        }
      });
  }
}
