import { isPlatformBrowser } from '@angular/common';
import { effect, inject, PLATFORM_ID, signal, Signal } from '@angular/core';
import { Breakpoint, BreakpointQueries } from '@ngx-oneforall/constants';

type BreakpointInput = Breakpoint | string;
export interface BreakpointResult {
  matches: boolean;
  breakpoints: Record<string, boolean>;
}

export function breakpointMatcher(
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

    startListener(mediaQuery, handler);
  }

  return state.asReadonly();
}

export function breakpointMatcherMultiple(
  breakpoints: BreakpointInput[]
): Signal<BreakpointResult> {
  const platformId = inject(PLATFORM_ID);
  const state = signal<BreakpointResult>({ matches: false, breakpoints: {} });
  if (isPlatformBrowser(platformId) && window.matchMedia) {
    const reverseMap = new Map<string, Breakpoint>();
    const queries = breakpoints.map(b => {
      if (isBreakpoint(b)) {
        // Store for later reverse mapping
        reverseMap.set(BreakpointQueries[b], b);
        return BreakpointQueries[b];
      }
      return b;
    });

    queries.forEach(query => {
      const mediaQuery = window.matchMedia(query);

      const updatedBreakpoints = {
        ...state().breakpoints,
        [reverseMap.get(query)!]: mediaQuery.matches,
      };
      // Set initial state
      state.set({
        matches: someBreakpointMatch(updatedBreakpoints),
        breakpoints: updatedBreakpoints,
      });

      const handler = (event: MediaQueryListEvent) => {
        const updatedBreakpoints = {
          ...state().breakpoints,
          [reverseMap.get(query)!]: event.matches,
        };
        state.set({
          matches: someBreakpointMatch(updatedBreakpoints),
          breakpoints: updatedBreakpoints,
        });
      };

      startListener(mediaQuery, handler);
    });
  }
  return state;
}

function startListener(
  mediaQuery: MediaQueryList,
  handler: (event: MediaQueryListEvent) => void
) {
  // Added just for unsubscription
  effect(onCleanup => {
    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // @ts-expect-error deprecated API
      mediaQuery.addListener(handler);
    }

    onCleanup(() => {
      if ('removeEventListener' in mediaQuery) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        // @ts-expect-error deprecated API
        mediaQuery.removeListener(handler);
      }
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBreakpoint(value: any): value is Breakpoint {
  return value in Breakpoint;
}

function someBreakpointMatch(breakpoints: Record<string, boolean>): boolean {
  return Object.values(breakpoints).some(v => v);
}
