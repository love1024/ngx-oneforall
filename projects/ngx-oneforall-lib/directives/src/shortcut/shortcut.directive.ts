import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

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
    private readonly host = inject(ElementRef<HTMLElement>)

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

        const shortcuts = this.shortcut()
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        for (const sc of shortcuts) {
            if (this.matchesShortcut(sc, event)) {
                event.preventDefault();
                this.action.emit();
                return;
            }
        }
    }

    private matchesShortcut(shortcut: string, event: KeyboardEvent): boolean {
        const parts = shortcut.split('.').map(p => p.trim().toLowerCase());
        const mainKey = parts.at(-1)!;
        const modifiers = parts.slice(0, -1);

        if (event.key.toLowerCase() !== mainKey) return false;

        const expectCtrl = modifiers.includes('ctrl') || modifiers.includes('control');
        const expectShift = modifiers.includes('shift');
        const expectAlt = modifiers.includes('alt');
        const expectMeta = modifiers.includes('meta') || modifiers.includes('cmd') || modifiers.includes('command');

        if (event.ctrlKey !== expectCtrl) return false;
        if (event.shiftKey !== expectShift) return false;
        if (event.altKey !== expectAlt) return false;
        if (event.metaKey !== expectMeta) return false;

        // Reject extra pressed non-modifier keys
        for (const key of this.pressedKeys) {
            if (key === mainKey) continue;
            if (['control', 'shift', 'alt', 'meta'].includes(key)) continue;
            return false;
        }

        return true;
    }
}
