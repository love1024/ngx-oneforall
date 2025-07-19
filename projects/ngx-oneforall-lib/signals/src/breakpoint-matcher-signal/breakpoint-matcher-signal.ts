import { isPlatformBrowser } from '@angular/common';
import { effect, inject, PLATFORM_ID, signal, Signal } from '@angular/core';
import { Breakpoint, BreakpointQueries } from '@ngx-oneforall/constants';

type BreakpointInput = Breakpoint | string;
export interface BreakpointResult {
  matches: boolean;
  breakpoints: Record<string, boolean>;
}

export function breakpointMatcherSignal(
  breakpoint: BreakpointInput
): Signal<boolean> {
  const platformId = inject(PLATFORM_ID);
  const state = signal<boolean>(breakpoint === 'all' || breakpoint === '');
  if (isPlatformBrowser(platformId) && window.matchMedia) {
    const query = isBreakpoint(breakpoint)
      ? BreakpointQueries[breakpoint]
      : breakpoint;

    const mediaQuery = window.matchMedia(query);
    state.set(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => state.set(event.matches);

    // Added just for unsubscription
    effect(() => {
      if ('addEventListener' in mediaQuery) {
        mediaQuery.addEventListener('change', handler);
      } else {
        // @ts-expect-error deprecated API
        mediaQuery.addListener(handler);
      }

      return () => {
        if ('removeEventListener' in mediaQuery) {
          mediaQuery.removeEventListener('change', handler);
        } else {
          // @ts-expect-error deprecated API
          mediaQuery.removeListener(handler);
        }
      };
    });
  }

  return state.asReadonly();
}

export function breakpointMatcherMultipleSignal(
  breakpoints: BreakpointInput[]
): Signal<BreakpointResult> {
  const platformId = inject(PLATFORM_ID);
  const state = signal<BreakpointResult>({ matches: false, breakpoints: {} });
  if (isPlatformBrowser(platformId) && window.matchMedia) {
    const queries = breakpoints.map(b =>
      isBreakpoint(b) ? BreakpointQueries[b] : b
    );

    queries.forEach(query => {
      const mediaQuery = window.matchMedia(query);
      state.set({
        matches: state().matches || mediaQuery.matches,
        breakpoints: {
          ...state().breakpoints,
          query: mediaQuery.matches,
        },
      });

      const handler = (event: MediaQueryListEvent) => {
        state.set({
          matches: state().matches || event.matches,
          breakpoints: {
            ...state().breakpoints,
            query: event.matches,
          },
        });
      };

      // Added just for unsubscription
      effect(() => {
        if ('addEventListener' in mediaQuery) {
          mediaQuery.addEventListener('change', handler);
        } else {
          // @ts-expect-error deprecated API
          mediaQuery.addListener(handler);
        }

        return () => {
          if ('removeEventListener' in mediaQuery) {
            mediaQuery.removeEventListener('change', handler);
          } else {
            // @ts-expect-error deprecated API
            mediaQuery.removeListener(handler);
          }
        };
      });
    });
  }
  return state;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBreakpoint(value: any): value is Breakpoint {
  return value in Breakpoint;
}
