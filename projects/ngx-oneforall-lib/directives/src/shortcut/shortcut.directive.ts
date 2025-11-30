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
            this.pressedKeys.delete(event.key.toLowerCase());
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
            this.pressedKeys.delete(event.key.toLowerCase());
        }
    }

    @HostListener('window:blur')
    onBlur(): void {
        this.pressedKeys.clear();
    }


    private handleKey(event: KeyboardEvent): void {
        // If element-scoped, ensure focus is inside host element
        if (!this.isGlobal()) {
            if (!this.host.nativeElement.contains(document.activeElement)) {
                return;
            }
        }

        this.pressedKeys.add(event.key.toLowerCase());

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

        const eventKey = event.key.toLowerCase();
        const eventCode = event.code.toLowerCase();

        // Try to match the key using hybrid approach:
        // 1. First try event.key (what the user sees/types)
        // 2. Then try event.code (physical key position)
        const keyMatches = eventKey === mainKey || this.matchesCode(mainKey, eventCode);

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

        // Reject extra pressed non-modifier keys
        // Allowed keys = mainKey + standard modifiers + other modifiers
        const allowedKeys = new Set<string>([
            mainKey,
            'control', 'shift', 'alt', 'meta',
            ...otherModifiers
        ]);

        // If we matched via code (physical key), we must allow the actual key produced
        // Examples: Shift+1 = !, Option+s = ß, etc.
        if (eventKey !== mainKey) {
            allowedKeys.add(eventKey);
        }

        for (const key of this.pressedKeys) {
            if (allowedKeys.has(key)) continue;
            return false;
        }

        return true;
    }

    /**
     * Check if the mainKey matches the event.code (physical key position)
     * This allows shortcuts to work regardless of keyboard layout
     */
    private matchesCode(mainKey: string, eventCode: string): boolean {
        // Letter keys: a-z → KeyA-KeyZ
        if (mainKey.match(/^[a-z]$/)) {
            return eventCode === `key${mainKey}`;
        }

        // Number keys: 0-9 → Digit0-Digit9
        if (mainKey.match(/^[0-9]$/)) {
            return eventCode === `digit${mainKey}`;
        }

        // Special keys that have the same code
        const specialKeys: Record<string, string> = {
            'space': 'space',
            ' ': 'space',
            'enter': 'enter',
            'tab': 'tab',
            'escape': 'escape',
            'backspace': 'backspace',
            'arrowup': 'arrowup',
            'arrowdown': 'arrowdown',
            'arrowleft': 'arrowleft',
            'arrowright': 'arrowright',
        };

        return specialKeys[mainKey] === eventCode;
    }
}
