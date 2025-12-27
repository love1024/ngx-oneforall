import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface AppEvent<T = unknown> {
  name: string;
  data?: T;
}

@Injectable()
export class EventService {
  private emitter = new Subject<AppEvent>();

  dispatchEvent(name: string, data?: unknown): void {
    this.emitter.next({ name, data });
  }

  getEventEmitter<T = unknown>(): Observable<AppEvent<T>> {
    return this.emitter.asObservable() as Observable<AppEvent<T>>;
  }
}
