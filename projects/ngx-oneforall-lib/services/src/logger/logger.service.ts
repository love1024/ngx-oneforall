import { inject, Injectable, InjectionToken } from '@angular/core';

export const DISABLE_LOGGER = new InjectionToken<boolean>('DISABLE_LOGGER');

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  public log = console.log.bind(console.log);
  public error = console.error.bind(console.error);
  public warn = console.warn.bind(console.warn);
  public debug = console.debug.bind(console.debug);

  constructor() {
    if (inject(DISABLE_LOGGER)) {
      this.debug = this.noopLogger();
      this.log = this.noopLogger();
      this.warn = this.noopLogger();
      this.log = this.noopLogger();
    }
  }

  private noopLogger() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    return (..._: unknown[]) => {};
  }
}
