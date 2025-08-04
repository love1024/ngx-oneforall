import { Provider } from '@angular/core';
import { EventService } from './event.service';

export function provideEventService(): Provider {
  return EventService;
}
