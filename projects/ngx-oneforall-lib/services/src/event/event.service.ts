import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface AppEvent<T> {
  name: T;
  data?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class EventService<T = string> {
  private emitter = new Subject<AppEvent<T>>();

  dispatchEvent(name: T, data?: unknown): void {
    this.emitter.next({ name, data });
  }

  getEventEmitter(): Observable<AppEvent<T>> {
    return this.emitter.asObservable();
  }
}
