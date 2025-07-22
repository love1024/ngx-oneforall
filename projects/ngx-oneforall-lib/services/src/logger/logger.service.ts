import { inject, Injectable, InjectionToken } from '@angular/core';

export type LogMethod = (...args: unknown[]) => void;

export interface CustomLogger {
  log: LogMethod;
  error: LogMethod;
  warn: LogMethod;
  debug: LogMethod;
}

export const DISABLE_LOGGER = new InjectionToken<boolean>('DISABLE_LOGGER');
export const CUSTOM_LOGGER = new InjectionToken<CustomLogger>('CUSTOM_LOGGER');

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  public log: LogMethod;
  public error: LogMethod;
  public warn: LogMethod;
  public debug: LogMethod;

  constructor() {
    const disabled = inject(DISABLE_LOGGER, { optional: true }) ?? false;
    const customLogger = inject(CUSTOM_LOGGER, { optional: true });

    if (disabled) {
      this.log = this.error = this.warn = this.debug = this.noopLogger();
    } else if (customLogger) {
      this.log = customLogger.log.bind(customLogger);
      this.error = customLogger.error.bind(customLogger);
      this.warn = customLogger.warn.bind(customLogger);
      this.debug = customLogger.debug.bind(customLogger);
    } else {
      this.log = console.log.bind(console);
      this.error = console.error.bind(console);
      this.warn = console.warn.bind(console);
      this.debug = console.debug.bind(console);
    }
  }

  private noopLogger(): LogMethod {
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    return (...args: unknown[]) => {};
  }
}
