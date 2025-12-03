import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

export type ModifierKey =
    | 'shift'
    | 'control'
    | 'alt'
    | 'meta'
    | 'altleft'
    | 'backspace'
    | 'tab'
    | 'left'
    | 'right'
    | 'up'
    | 'down'
    | 'enter'
    | 'space'
    | 'escape';

import { getHostPlatform, normalizeKey } from '@ngx-oneforall/utils';

@Directive({
    selector: '[shortcut]',
    standalone: true
})
export class ShortcutDirective {
    /**
     * Example usage:
     * [shortcut]="'ctrl.s, meta.s, ctrl.shift.s'"
     */
    shortcut = input.required<string>();

    /**
     * If true → listen globally (window)
     * Default → element scope only
     */
    isGlobal = input<boolean>(false);
    action = output<void>();

    private pressedKeys = new Set<string>();
    private readonly host = inject(ElementRef<HTMLElement>);
    private readonly platform = getHostPlatform();

    // Element Scoped Listeners
    @HostListener('keydown', ['$event'])
    onElementKeyDown(event: KeyboardEvent): void {
        if (!this.isGlobal()) {
            this.handleKey(event);
        }
    }

    @HostListener('keyup', ['$event'])
    onElementKeyUp(event: KeyboardEvent): void {
        if (!this.isGlobal()) {
            // Filter out dead keys, IME composition, and unidentified keys
            if (this.isDeadOrIgnoredKey(event.key)) {
                return;
            }
            const normalizedKey = normalizeKey(event.key, this.platform);
            this.pressedKeys.delete(normalizedKey);
        }
    }

    // Global Listeners
    @HostListener('window:keydown', ['$event'])
    onWindowKeyDown(event: KeyboardEvent): void {
        if (this.isGlobal()) {
            this.handleKey(event);
        }
    }

    @HostListener('window:keyup', ['$event'])
    onWindowKeyUp(event: KeyboardEvent): void {
        if (this.isGlobal()) {
            // Filter out dead keys, IME composition, and unidentified keys
            if (this.isDeadOrIgnoredKey(event.key)) {
                return;
            }
            const normalizedKey = normalizeKey(event.key, this.platform);
            this.pressedKeys.delete(normalizedKey);
        }
    }

    @HostListener('window:blur')
    onBlur(): void {
        this.pressedKeys.clear();
    }

    @HostListener('document:visibilitychange')
    onVisibilityChange(): void {
        // Clear pressed keys when tab becomes hidden (user switches to another app/tab)
        // This catches cases that blur doesn't, like switching to DevTools or another application
        if (document.hidden) {
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

        // Filter out dead keys, IME composition, and unidentified keys
        if (this.isDeadOrIgnoredKey(event.key)) {
            return;
        }

        // Normalize the key before storing
        // Special handling for space: don't lowercase it first as normalizeKey will handle it
        const normalizedKey = normalizeKey(event.key, this.platform);
        this.pressedKeys.add(normalizedKey);

        const normalizedShortcuts = this.shortcut()
            .split(',')
            .map(s =>
                s
                    .split('.')
                    .map((s) => normalizeKey(s, this.platform))
                    .join('.')
            )
            .filter(Boolean);

        for (const sc of normalizedShortcuts) {
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

        // Main key match: eventKey or layout-independent event.code
        const keyMatches = eventKey === mainKey || eventCode === mainKey;

        if (!keyMatches) {
            return false;
        }

        const expectCtrl = modifiers.includes('ctrl') || modifiers.includes('control');
        const expectShift = modifiers.includes('shift');
        const expectAlt = modifiers.includes('alt');
        const expectMeta = modifiers.includes('meta') || modifiers.includes('cmd') || modifiers.includes('command');

        if (event.ctrlKey !== expectCtrl) return false;
        if (event.shiftKey !== expectShift) return false;
        if (event.altKey !== expectAlt) return false;
        if (event.metaKey !== expectMeta) return false;

        // Check for other modifiers (non-standard modifiers like space, enter, arrows)
        // These keys must be present in pressedKeys as not present in event
        const otherModifiers = modifiers.filter(m =>
            !['ctrl', 'control', 'shift', 'alt', 'meta', 'cmd', 'command'].includes(m)
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
            'minus', 'equal', 'slash', 'backslash',
            'semicolon', 'quote', 'comma', 'period',
            'bracketleft', 'bracketright', 'backquote'
        ];
        if (direct.includes(c)) return c;

        // Intl keys
        if (c === 'intlbackslash') return 'backslash';
        if (c === 'intlro') return 'slash';
        if (c === 'intlyen') return 'backslash';

        // Numpad extended keys
        const numpadMap: Record<string, string> = {
            'numpadadd': 'numpadadd',
            'numpadsubtract': 'numpadsubtract',
            'numpadmultiply': 'numpadmultiply',
            'numpaddivide': 'numpaddivide',
            'numpaddecimal': 'numpaddecimal',
            'numpadequal': 'numpadequal',
            'numpadcomma': 'numpadcomma',
            'numpadenter': 'enter',
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
