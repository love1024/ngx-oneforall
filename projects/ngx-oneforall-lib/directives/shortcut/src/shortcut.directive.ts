import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { getHostPlatform } from '@ngx-oneforall/utils/host-platform';
import { normalizeKey } from '@ngx-oneforall/utils/normalize-key';

@Directive({
  selector: '[shortcut]',
  host: {
    '(keydown)': 'onElementKeyDown($event)',
    '(keyup)': 'onElementKeyUp($event)',
    '(window:keydown)': 'onWindowKeyDown($event)',
    '(window:keyup)': 'onWindowKeyUp($event)',
    '(window:blur)': 'onBlur()',
    '(document:visibilitychange)': 'onVisibilityChange()',
  },
})
export class ShortcutDirective {
  /**
   * Keyboard shortcut pattern(s) to match.
   * @example [shortcut]="'ctrl.s, meta.s, ctrl.shift.s'"
   */
  shortcut = input.required<string>();

  /**
   * If true, listen globally on window.
   * Default is element scope only.
   */
  isGlobal = input<boolean>(false);

  /** Emits when shortcut is triggered */
  action = output<void>();

  private pressedKeys = new Set<string>();
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly platform = getHostPlatform();

  /** Cached normalized shortcuts for performance */
  private normalizedShortcuts = computed(() =>
    this.shortcut()
      .split(',')
      .map(s =>
        s
          .trim()
          .split('.')
          .map(k => normalizeKey(k, this.platform))
          .join('.')
      )
      .filter(Boolean)
  );

  onElementKeyDown(event: KeyboardEvent): void {
    if (!this.isGlobal()) {
      this.handleKey(event);
    }
  }

  onElementKeyUp(event: KeyboardEvent): void {
    if (!this.isGlobal()) {
      if (this.isDeadOrIgnoredKey(event.key)) {
        return;
      }
      const normalizedKey = normalizeKey(event.key, this.platform);
      this.pressedKeys.delete(normalizedKey);
    }
  }

  onWindowKeyDown(event: KeyboardEvent): void {
    if (this.isGlobal()) {
      this.handleKey(event);
    }
  }

  onWindowKeyUp(event: KeyboardEvent): void {
    if (this.isGlobal()) {
      if (this.isDeadOrIgnoredKey(event.key)) {
        return;
      }
      const normalizedKey = normalizeKey(event.key, this.platform);
      this.pressedKeys.delete(normalizedKey);
    }
  }

  onBlur(): void {
    this.pressedKeys.clear();
  }

  onVisibilityChange(): void {
    // SSR safe check
    if (typeof document !== 'undefined' && document.hidden) {
      this.pressedKeys.clear();
    }
  }

  private handleKey(event: KeyboardEvent): void {
    // If element-scoped, ensure event originated from host element
    if (!this.isGlobal()) {
      if (!event.composedPath().includes(this.host.nativeElement)) {
        return;
      }
    }

    if (this.isDeadOrIgnoredKey(event.key)) {
      return;
    }

    const normalizedKey = normalizeKey(event.key, this.platform);
    this.pressedKeys.add(normalizedKey);

    // Use cached computed shortcuts
    for (const sc of this.normalizedShortcuts()) {
      if (this.matchesShortcut(sc, event)) {
        event.preventDefault();
        this.action.emit();
        return;
      }
    }
  }

  private matchesShortcut(shortcut: string, event: KeyboardEvent): boolean {
    const parts = shortcut.split('.');
    const mainKey = parts.at(-1)!;
    const modifiers = parts.slice(0, -1);

    const eventKey = normalizeKey(event.key, this.platform);
    const eventCode = this.normalizeCode(event.code?.toLowerCase() ?? '');

    const keyMatches = eventKey === mainKey || eventCode === mainKey;

    if (!keyMatches) {
      return false;
    }

    const expectCtrl =
      modifiers.includes('ctrl') || modifiers.includes('control');
    const expectShift = modifiers.includes('shift');
    const expectAlt = modifiers.includes('alt');
    const expectMeta =
      modifiers.includes('meta') ||
      modifiers.includes('cmd') ||
      modifiers.includes('command');

    if (event.ctrlKey !== expectCtrl) return false;
    if (event.shiftKey !== expectShift) return false;
    if (event.altKey !== expectAlt) return false;
    if (event.metaKey !== expectMeta) return false;

    const otherModifiers = modifiers.filter(
      m =>
        !['ctrl', 'control', 'shift', 'alt', 'meta', 'cmd', 'command'].includes(
          m
        )
    );

    for (const mod of otherModifiers) {
      if (!this.pressedKeys.has(mod)) return false;
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

  private isDeadOrIgnoredKey(key: string): boolean {
    return ['Dead', 'Process', 'Unidentified'].includes(key);
  }
}
