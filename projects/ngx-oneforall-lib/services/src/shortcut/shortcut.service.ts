import { Injectable, NgZone, inject, OnDestroy } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { getHostPlatform, normalizeKey } from '@ngx-oneforall/utils';

export interface ShortcutOptions {
    key: string;
    isGlobal?: boolean;
    preventDefault?: boolean;
    element?: HTMLElement;
}

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

@Injectable()
export class ShortcutService implements OnDestroy {
    private readonly zone = inject(NgZone);
    private readonly pressedKeys = new Set<string>();
    private readonly platform = getHostPlatform();

    private readonly keydownHandler = (e: KeyboardEvent) => this.pressedKeys.add(e.key.toLowerCase());
    private readonly keyupHandler = (e: KeyboardEvent) => this.pressedKeys.delete(e.key.toLowerCase());
    private readonly blurHandler = () => this.pressedKeys.clear();

    constructor() {
        // Track keys globally to ensure we know what's pressed even if focus changes
        this.zone.runOutsideAngular(() => {
            window.addEventListener('keydown', this.keydownHandler);
            window.addEventListener('keyup', this.keyupHandler);
            window.addEventListener('blur', this.blurHandler);
        });
    }

    ngOnDestroy(): void {
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('keyup', this.keyupHandler);
        window.removeEventListener('blur', this.blurHandler);
    }

    observe(options: ShortcutOptions): Observable<KeyboardEvent> {
        const { key, isGlobal = false, preventDefault = true, element } = options;

        const target = isGlobal ? window : (element || window);

        return fromEvent<KeyboardEvent>(target, 'keydown').pipe(
            filter(event => this.matchesShortcut(key, event)),
            tap(event => {
                if (preventDefault) {
                    event.preventDefault();
                }
            })
        );
    }

    private matchesShortcut(shortcut: string, event: KeyboardEvent): boolean {
        const normalizedShortcuts = shortcut
            .split(',')
            .map(s =>
                s
                    .split('.')
                    .map((s) => normalizeKey(s, this.platform))
                    .join('.')
            )
            .filter(Boolean);

        for (const s of normalizedShortcuts) {
            if (this.checkSingleShortcut(s, event)) {
                return true;
            }
        }
        return false;
    }

    private checkSingleShortcut(shortcut: string, event: KeyboardEvent): boolean {
        const parts = shortcut.split('.');
        const mainKey = parts.at(-1)!;
        const modifiers = parts.slice(0, -1);

        const eventKey = event.key.toLowerCase();

        // On macOS, Option + Key often produces special characters (e.g. Option+s = ß)
        // If the key doesn't match and Alt is pressed, try matching against event.code
        if (eventKey !== mainKey) {
            if (event.altKey && event.code.toLowerCase() === `key${mainKey}`) {
                // Match found via code
            } else {
                return false;
            }
        }

        const expectCtrl = modifiers.includes('ctrl') || modifiers.includes('control');
        const expectShift = modifiers.includes('shift');
        const expectAlt = modifiers.includes('alt');
        const expectMeta = modifiers.includes('meta') || modifiers.includes('cmd') || modifiers.includes('command');

        if (event.ctrlKey !== expectCtrl) return false;
        if (event.shiftKey !== expectShift) return false;
        if (event.altKey !== expectAlt) return false;
        if (event.metaKey !== expectMeta) return false;

        const otherModifiers = modifiers.filter(m =>
            !['ctrl', 'control', 'shift', 'alt', 'meta', 'cmd', 'command'].includes(m)
        );

        for (const mod of otherModifiers) {
            if (!this.pressedKeys.has(mod)) return false;
        }

        const allowedKeys = new Set<string>([
            mainKey,
            'control', 'shift', 'alt', 'meta',
            ...otherModifiers
        ]);

        // If we matched via code (e.g. Option+s = ß), we must allow the actual key produced
        if (eventKey !== mainKey && event.altKey && event.code.toLowerCase() === `key${mainKey}`) {
            allowedKeys.add(eventKey);
        }

        for (const key of this.pressedKeys) {
            if (allowedKeys.has(key)) continue;
            return false;
        }

        return true;
    }
}
