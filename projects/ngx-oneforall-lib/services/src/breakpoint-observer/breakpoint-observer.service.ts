import { Platform } from '@angular/cdk/platform';
import { CSP_NONCE, inject, Injectable } from '@angular/core';
import { Breakpoint } from '@ngx-oneforall/constants';

type BreakpointString = Breakpoint | string;

/** Global registry for all dynamically-created, injected media queries. */
const mediaQueriesForWebkitCompatibility: Set<string> = new Set<string>();

/** Style tag that holds all of the dynamically-created media queries. */
let mediaQueryStyleNode: HTMLStyleElement | undefined;

@Injectable({ providedIn: 'root' })
export class BreakpointObserver {
  private platform = inject(Platform);
  private matchMedia?: (query: string) => MediaQueryList;
  private _nonce = inject(CSP_NONCE, { optional: true });

  constructor() {
    if (this.platform.isBrowser && window.matchMedia) {
      this.matchMedia = window.matchMedia;
    }
  }

  observe(breakpoints: BreakpointString | BreakpointString[]) {
    const queries = this.toArray(breakpoints);
  }

  isMatched(breakpoints: BreakpointString | BreakpointString[]): boolean {
    const queries = this.toArray(breakpoints);
    return queries.some(q => {
      if (this.platform.WEBKIT || this.platform.BLINK) {
        this.createEmptyStyleRule(q, this._nonce);
      }
      return this.matchMedia?.(q).matches;
    });
  }

  private toArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
  }

  /**
   * https://github.com/angular/components/blob/main/src/cdk/layout/media-matcher.ts#L51
   */
  private createEmptyStyleRule(
    query: string,
    nonce: string | undefined | null
  ) {
    if (mediaQueriesForWebkitCompatibility.has(query)) {
      return;
    }

    try {
      if (!mediaQueryStyleNode) {
        mediaQueryStyleNode = document.createElement('style');

        if (nonce) {
          mediaQueryStyleNode.setAttribute('nonce', nonce);
        }

        mediaQueryStyleNode.setAttribute('type', 'text/css');
        document.head!.appendChild(mediaQueryStyleNode);
      }

      if (mediaQueryStyleNode.sheet) {
        mediaQueryStyleNode.sheet.insertRule(`@media ${query} {body{ }}`, 0);
        mediaQueriesForWebkitCompatibility.add(query);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
