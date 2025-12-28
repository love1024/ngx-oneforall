import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Application event structure.
 */
export interface AppEvent<T = unknown> {
  /** Event name/type */
  name: string;
  /** Optional event data */
  data?: T;
}

/**
 * Simple event bus service for application-wide event communication.
 * Allows dispatching and subscribing to typed events.
 */
@Injectable()
export class EventService {
  private emitter = new Subject<AppEvent>();

  /**
   * Dispatches an event to all listeners.
   * @param name - Event name
   * @param data - Optional event data
   */
  dispatchEvent(name: string, data?: unknown): void {
    this.emitter.next({ name, data });
  }

  /**
   * Returns an observable to listen for events.
   * @returns Observable of AppEvent
   */
  getEventEmitter<T = unknown>(): Observable<AppEvent<T>> {
    return this.emitter.asObservable() as Observable<AppEvent<T>>;
  }
}
