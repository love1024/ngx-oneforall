import { InjectionToken, Provider } from '@angular/core';
import { IdleService } from './idle.service';

/**
 * Configuration options for the IdleService.
 */
export interface IdleOptions {
  /**
   * Time in milliseconds before user is considered idle.
   * @default 300000 (5 minutes)
   */
  timeout?: number;
  /**
   * DOM events to monitor for activity.
   * @default ['mousemove', 'keydown', 'touchstart', 'scroll', 'click']
   */
  events?: string[];
}

export const DEFAULT_IDLE_OPTIONS: Required<IdleOptions> = {
  timeout: 300000,
  events: ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'],
};

export const IDLE_CONFIG = new InjectionToken<IdleOptions>('IDLE_CONFIG');

/**
 * Provides IdleService with optional configuration.
 *
 * @example
 * ```typescript
 * // app.config.ts or component providers
 * providers: [
 *   provideIdleService({ timeout: 60000 }) // 1 minute
 * ]
 * ```
 *
 * @param options - Configuration options for IdleService
 * @returns Providers array for IdleService
 */
export function provideIdleService(options?: IdleOptions): Provider[] {
  const mergedOptions = { ...DEFAULT_IDLE_OPTIONS, ...options };
  return [
    IdleService,
    {
      provide: IDLE_CONFIG,
      useValue: mergedOptions,
    },
  ];
}
