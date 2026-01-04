import { InjectionToken, Provider } from '@angular/core';
import { HistoryService } from './history.service';

/**
 * Configuration options for the history service.
 */
export interface HistoryOptions {
  /**
   * Maximum number of entries to keep in the history stack.
   * @default 50
   */
  maxSize?: number;
}

export const DEFAULT_HISTORY_OPTIONS: Required<HistoryOptions> = {
  maxSize: 50,
};

/**
 * Injection token for history configuration.
 */
export const HISTORY_CONFIG = new InjectionToken<HistoryOptions>(
  'HISTORY_CONFIG'
);

/**
 * Provides the HistoryService with optional configuration.
 * After providing, call `historyService.startTracking()` to begin tracking.
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * providers: [provideHistoryService({ maxSize: 100 })]
 *
 * // In AppComponent
 * constructor() {
 *   inject(HistoryService).startTracking();
 * }
 * ```
 */
export function provideHistoryService(options?: HistoryOptions): Provider[] {
  return [
    HistoryService,
    {
      provide: HISTORY_CONFIG,
      useValue: options ?? DEFAULT_HISTORY_OPTIONS,
    },
  ];
}
