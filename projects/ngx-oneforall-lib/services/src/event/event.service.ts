import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface AppEvent<T = string> {
  name: T;
  data?: unknown;
}

@Injectable()
export class EventService {
  private emitter = new Subject<AppEvent>();

  dispatchEvent(name: string, data?: unknown): void {
    this.emitter.next({ name, data });
  }

  getEventEmitter(): Observable<AppEvent> {
    return this.emitter.asObservable();
  }
}
