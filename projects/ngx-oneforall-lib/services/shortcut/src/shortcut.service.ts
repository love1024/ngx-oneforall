import {
  Injectable,
  NgZone,
  inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { Observable, fromEvent, NEVER } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { getHostPlatform } from 'ngx-oneforall/utils/host-platform';
import { normalizeKey } from 'ngx-oneforall/utils/normalize-key';
import { isPlatformBrowser } from '@angular/common';

export interface ShortcutOptions {
  key: string; // e.g., "ctrl.s", "meta.shift.n"
  isGlobal?: boolean;
  preventDefault?: boolean;
  element?: HTMLElement;
}

@Injectable()
export class ShortcutService implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly pressedKeys = new Set<string>();
  private readonly pressedCodes = new Set<string>();
  private readonly platform = getHostPlatform();

  private readonly keydownHandler = (event: KeyboardEvent) => {
    if (this.isDeadOrIgnoredKey(event.key)) return;

    const normalizedKey = normalizeKey(event.key, this.platform);
    this.pressedKeys.add(normalizedKey);

    this.pressedCodes.add(event.code?.toLowerCase());
  };

  private readonly keyupHandler = (event: KeyboardEvent) => {
    if (this.isDeadOrIgnoredKey(event.key)) return;

    const normalizedKey = normalizeKey(event.key, this.platform);
    this.pressedKeys.delete(normalizedKey);

    this.pressedCodes.delete(event.code?.toLowerCase());
  };

  private readonly blurHandler = () => this.clearPressed();
  private readonly visibilityChangeHandler = () => {
    /* istanbul ignore else */
    if (document.hidden) this.clearPressed();
  };

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      window.addEventListener('keydown', this.keydownHandler);
      window.addEventListener('keyup', this.keyupHandler);
      window.addEventListener('blur', this.blurHandler);
      document.addEventListener(
        'visibilitychange',
        this.visibilityChangeHandler
      );
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
    window.removeEventListener('blur', this.blurHandler);
    document.removeEventListener(
      'visibilitychange',
      this.visibilityChangeHandler
    );
  }

  observe(options: ShortcutOptions): Observable<KeyboardEvent> {
    if (!isPlatformBrowser(this.platformId)) {
      return NEVER;
    }
    const { key, isGlobal = false, preventDefault = true, element } = options;
    const target: EventTarget = isGlobal ? window : element || window;

    const descriptors = key
      .split(',')
      .map(s => s.trim())
      .map(s => this.parseSingleShortcut(s));

    return fromEvent<KeyboardEvent>(target, 'keydown').pipe(
      filter(event => {
        // if element-scoped, event must originate from element
        if (!isGlobal && element && !this.isEventFromElement(event, element)) {
          return false;
        }

        return descriptors.some(d => this.matchesDescriptor(d, event));
      }),
      tap(event => {
        if (preventDefault) event.preventDefault();
      })
    );
  }

  private clearPressed(): void {
    this.pressedKeys.clear();
    this.pressedCodes.clear();
  }

  private isDeadOrIgnoredKey(key: string): boolean {
    return ['Dead', 'Process', 'Unidentified'].includes(key);
  }

  private parseSingleShortcut(shortcut: string) {
    const parts = shortcut.toLowerCase().split('.');
    const mainKey = normalizeKey(parts.pop()!, this.platform);
    const modifiers = new Set(parts.map(p => normalizeKey(p, this.platform)));

    return { mainKey, modifiers };
  }

  private isEventFromElement(
    event: KeyboardEvent,
    element: HTMLElement
  ): boolean {
    return event.composedPath().includes(element);
  }

  private matchesDescriptor(
    descriptor: { mainKey: string; modifiers: Set<string> },
    event: KeyboardEvent
  ): boolean {
    const { mainKey, modifiers } = descriptor;
    const eventKey = normalizeKey(event.key, this.platform);
    const eventCode = this.normalizeCode(event.code?.toLowerCase());

    // Main key match: eventKey or layout-independent event.code
    const mainKeyMatches = eventKey === mainKey || eventCode === mainKey;

    if (!mainKeyMatches) return false;

    if (event.ctrlKey !== modifiers.has('control')) return false;
    if (event.shiftKey !== modifiers.has('shift')) return false;
    if (event.altKey !== modifiers.has('alt')) return false;
    if (event.metaKey !== modifiers.has('meta')) return false;

    // Other keys check: pressedKeys must include all named modifiers
    for (const mod of modifiers) {
      if (
        !['control', 'shift', 'alt', 'meta'].includes(mod) &&
        !this.pressedKeys.has(mod)
      ) {
        return false;
      }
    }

    return true;
  }

  private normalizeCode(code: string): string | null {
    if (!code) return null;
    const c = code.toLowerCase();

    // KeyA → "a"
    if (/^key[a-z]$/.test(c)) return c.slice(3);

    // Digit5 → "5"
    if (/^digit[0-9]$/.test(c)) return c.slice(5);

    // Numpad0 → "0"
    if (/^numpad[0-9]$/.test(c)) return c.slice(6);

    // Named keys matching our normalized names
    const direct = [
      'minus',
      'equal',
      'slash',
      'backslash',
      'semicolon',
      'quote',
      'comma',
      'period',
      'bracketleft',
      'bracketright',
      'backquote',
    ];
    if (direct.includes(c)) return c;

    // Intl keys
    if (c === 'intlbackslash') return 'backslash';
    if (c === 'intlro') return 'slash';
    if (c === 'intlyen') return 'backslash';

    // Numpad extended keys
    const numpadMap: Record<string, string> = {
      numpadadd: 'numpadadd',
      numpadsubtract: 'numpadsubtract',
      numpadmultiply: 'numpadmultiply',
      numpaddivide: 'numpaddivide',
      numpaddecimal: 'numpaddecimal',
      numpadequal: 'numpadequal',
      numpadcomma: 'numpadcomma',
      numpadenter: 'enter',
    };
    if (numpadMap[c]) return numpadMap[c];

    // Modifiers from code
    if (c.startsWith('shift')) return 'shift';
    if (c.startsWith('control')) return 'control';
    if (c.startsWith('alt')) return 'alt';
    if (c.startsWith('meta')) return 'meta';

    return null;
  }
}
