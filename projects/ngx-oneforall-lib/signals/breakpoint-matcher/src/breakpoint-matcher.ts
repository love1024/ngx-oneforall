import { isPlatformBrowser } from '@angular/common';
import { effect, inject, PLATFORM_ID, signal, Signal } from '@angular/core';
import {
  BREAKPOINT,
  Breakpoint,
  BREAKPOINT_QUERY,
} from '@ngx-oneforall/constants';

type BreakpointInput = Breakpoint | string;
export interface BreakpointResult {
  some: boolean;
  all: boolean;
  breakpoints: Record<string, boolean>;
}

export function breakpointMatcher(
  breakpoint: BreakpointInput
): Signal<boolean> {
  const platformId = inject(PLATFORM_ID);
  const state = signal<boolean>(false);
  if (isPlatformBrowser(platformId) && window.matchMedia) {
    const query = isBreakpoint(breakpoint)
      ? BREAKPOINT_QUERY[breakpoint]
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
  const state = signal<BreakpointResult>({
    some: false,
    all: false,
    breakpoints: {},
  });
  if (isPlatformBrowser(platformId) && window.matchMedia) {
    const reverseMap = new Map<string, Breakpoint>();
    const queries = breakpoints.map(b => {
      if (isBreakpoint(b)) {
        // Store for later reverse mapping
        reverseMap.set(BREAKPOINT_QUERY[b], b);
        return BREAKPOINT_QUERY[b];
      }
      return b;
    });

    // Build initial state in one pass
    const initialBreakpoints: Record<string, boolean> = {};
    const mediaQueries = queries.map(query => {
      const mq = window.matchMedia(query);
      initialBreakpoints[reverseMap.get(query) || query] = mq.matches;
      return { query, mq };
    });

    // Set initial state once
    state.set({
      some: someBreakpointMatch(initialBreakpoints),
      all: allBreakpointMatch(initialBreakpoints),
      breakpoints: initialBreakpoints,
    });

    // Setup listeners for dynamic updates
    mediaQueries.forEach(({ query, mq }) => {
      const handler = (event: MediaQueryListEvent) => {
        const updatedBreakpoints = {
          ...state().breakpoints,
          [reverseMap.get(query) || query]: event.matches,
        };
        state.set({
          some: someBreakpointMatch(updatedBreakpoints),
          all: allBreakpointMatch(updatedBreakpoints),
          breakpoints: updatedBreakpoints,
        });
      };

      startListener(mq, handler);
    });
  }
  return state.asReadonly();
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
  return Object.values(BREAKPOINT).includes(value);
}

function someBreakpointMatch(breakpoints: Record<string, boolean>): boolean {
  return Object.values(breakpoints).some(v => v);
}

function allBreakpointMatch(breakpoints: Record<string, boolean>): boolean {
  const values = Object.values(breakpoints);
  return values.length > 0 && values.every(v => v);
}
