import {
  inject,
  Injectable,
  Injector,
  linkedSignal,
  DOCUMENT,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { fromEvent, map, merge } from 'rxjs';

@Injectable()
export class NetworkStatusService {
  private readonly isNetworkOnline = linkedSignal(
    () => this.window?.navigator?.onLine ?? true
  );
  private readonly injector = inject(Injector);
  private readonly window = inject(DOCUMENT).defaultView;

  constructor() {
    this.subscribeToNetworkStatus();
  }

  get isOnline() {
    return this.isNetworkOnline();
  }

  get isOffline() {
    return !this.isNetworkOnline();
  }

  get isOnline$() {
    return toObservable(this.isNetworkOnline, { injector: this.injector });
  }

  get isOnlineSignal() {
    return this.isNetworkOnline.asReadonly();
  }

  private subscribeToNetworkStatus() {
    if (!this.window) {
      return;
    }
    merge(
      fromEvent(this.window, 'online').pipe(map(() => true)),
      fromEvent(this.window, 'offline').pipe(map(() => false))
    )
      .pipe(takeUntilDestroyed())
      .subscribe(status => {
        this.isNetworkOnline.set(status);
      });
  }
}
