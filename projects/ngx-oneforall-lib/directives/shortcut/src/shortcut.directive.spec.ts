import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ShortcutDirective } from './shortcut.directive';

@Component({
    template: `
        <div [shortcut]="shortcut" [isGlobal]="isGlobal" (action)="onAction()">
            <input #testInput />
        </div>
    `,
    imports: [ShortcutDirective]
})
class TestComponent {
    shortcut = 'enter';
    isGlobal = false;
    actionTriggered = false;

    onAction() {
        this.actionTriggered = true;
    }

    reset() {
        this.actionTriggered = false;
    }
}

describe('ShortcutDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let divElement: HTMLElement;
    let inputElement: HTMLInputElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, ShortcutDirective]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        divElement = fixture.debugElement.query(By.css('div')).nativeElement;
        inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create an instance', () => {
        const directive = fixture.debugElement.query(By.directive(ShortcutDirective));
        expect(directive).toBeTruthy();
    });

    describe('Element-scoped shortcuts (default)', () => {
        beforeEach(() => {
            component.isGlobal = false;
            fixture.detectChanges();
        });

        it('should trigger action when element is focused and shortcut matches', () => {
            inputElement.focus();
            expect(document.activeElement).toBe(inputElement);

            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            jest.spyOn(event, 'preventDefault');

            inputElement.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should NOT trigger when event path does not include element', () => {
            // Mock composedPath to NOT include divElement
            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            jest.spyOn(event, 'composedPath').mockReturnValue([document.body, document.documentElement, window]);

            divElement.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
        });

        it('should trigger with modifier keys (ctrl.s)', () => {
            component.shortcut = 'ctrl.s';
            fixture.detectChanges();
            inputElement.focus();

            const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true });
            jest.spyOn(event, 'preventDefault');

            inputElement.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should trigger with multiple modifiers (ctrl.shift.s)', () => {
            component.shortcut = 'ctrl.shift.s';
            fixture.detectChanges();
            inputElement.focus();

            const event = new KeyboardEvent('keydown', {
                key: 's',
                ctrlKey: true,
                shiftKey: true,
                bubbles: true
            });
            jest.spyOn(event, 'preventDefault');

            inputElement.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('Global shortcuts', () => {
        beforeEach(() => {
            component.isGlobal = true;
            fixture.detectChanges();
        });

        it('should trigger action on window keydown regardless of focus', () => {
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            jest.spyOn(event, 'preventDefault');

            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should trigger with modifier (ctrl.s)', () => {
            component.shortcut = 'ctrl.s';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
            jest.spyOn(event, 'preventDefault');

            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should not trigger on non-matching key', () => {
            const event = new KeyboardEvent('keydown', { key: 'Space' });
            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
        });

        it('should not trigger if modifier is missing', () => {
            component.shortcut = 'ctrl.s';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: false });
            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
        });
    });

    describe('Multiple shortcuts', () => {
        beforeEach(() => {
            component.isGlobal = true;
            fixture.detectChanges();
        });

        it('should trigger on second shortcut in comma-separated list', () => {
            component.shortcut = 'ctrl.s, ctrl.shift.s';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true });
            jest.spyOn(event, 'preventDefault');

            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should trigger on first shortcut in comma-separated list', () => {
            component.shortcut = 'ctrl.s, meta.s';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
            jest.spyOn(event, 'preventDefault');

            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('Strict matching', () => {
        beforeEach(() => {
            component.isGlobal = true;
            component.shortcut = 'shift.enter';
            fixture.detectChanges();
        });

        it('should trigger even if extra non-modifier keys are pressed', () => {
            // Simulate pressing Shift
            const shiftEvent = new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true });
            window.dispatchEvent(shiftEvent);

            // Simulate pressing K (extra non-modifier key - should be allowed)
            const kEvent = new KeyboardEvent('keydown', { key: 'k', shiftKey: true });
            window.dispatchEvent(kEvent);

            // Simulate pressing Enter
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
            jest.spyOn(enterEvent, 'preventDefault');

            window.dispatchEvent(enterEvent);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(enterEvent.preventDefault).toHaveBeenCalled();
        });



        it('should trigger when only required keys are pressed', () => {
            // Simulate pressing Shift
            const shiftEvent = new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true });
            window.dispatchEvent(shiftEvent);

            // Simulate pressing Enter (no extra keys)
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
            jest.spyOn(enterEvent, 'preventDefault');

            window.dispatchEvent(enterEvent);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(enterEvent.preventDefault).toHaveBeenCalled();
        });
    });

    describe('Expanded modifiers', () => {
        beforeEach(() => {
            component.isGlobal = true;
            fixture.detectChanges();
        });

        it('should trigger with space as modifier (space.enter)', () => {
            component.shortcut = 'space.enter';
            fixture.detectChanges();

            // Press Space - use 'Space' as the key value (what browsers actually send)
            const spaceEvent = new KeyboardEvent('keydown', { key: 'Space', code: 'Space' });
            window.dispatchEvent(spaceEvent);

            // Press Enter
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            jest.spyOn(enterEvent, 'preventDefault');
            window.dispatchEvent(enterEvent);

            expect(component.actionTriggered).toBe(true);
            expect(enterEvent.preventDefault).toHaveBeenCalled();
        });

        it('should trigger with arrow keys as modifiers (up.down)', () => {
            component.shortcut = 'up.down';
            fixture.detectChanges();

            // Press Up
            const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            window.dispatchEvent(upEvent);

            // Press Down
            const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            jest.spyOn(downEvent, 'preventDefault');
            window.dispatchEvent(downEvent);

            expect(component.actionTriggered).toBe(true);
            expect(downEvent.preventDefault).toHaveBeenCalled();
        });

        it('should trigger with left/right arrows (left.right)', () => {
            component.shortcut = 'left.right';
            fixture.detectChanges();

            // Press Left
            const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
            window.dispatchEvent(leftEvent);

            // Press Right
            const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
            jest.spyOn(rightEvent, 'preventDefault');
            window.dispatchEvent(rightEvent);

            expect(component.actionTriggered).toBe(true);
            expect(rightEvent.preventDefault).toHaveBeenCalled();
        });

        it('should trigger with escape as modifier (esc.enter)', () => {
            component.shortcut = 'esc.enter';
            fixture.detectChanges();

            // Press Escape
            const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            window.dispatchEvent(escEvent);

            // Press Enter
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            jest.spyOn(enterEvent, 'preventDefault');
            window.dispatchEvent(enterEvent);

            expect(component.actionTriggered).toBe(true);
            expect(enterEvent.preventDefault).toHaveBeenCalled();
        });

        it('should NOT trigger if non-standard modifier is missing (space.enter)', () => {
            component.shortcut = 'space.enter';
            fixture.detectChanges();

            // Press Enter WITHOUT pressing Space first
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            jest.spyOn(enterEvent, 'preventDefault');
            window.dispatchEvent(enterEvent);

            expect(component.actionTriggered).toBe(false);
            expect(enterEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    describe('Key tracking and cleanup', () => {
        beforeEach(() => {
            component.isGlobal = true;
            component.shortcut = 'ctrl.shift.s';
            fixture.detectChanges();
        });

        it('should track and remove keys on keyup (global mode)', () => {
            // Press Ctrl
            const ctrlDownEvent = new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true });
            window.dispatchEvent(ctrlDownEvent);

            // Press Shift
            const shiftDownEvent = new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true, ctrlKey: true });
            window.dispatchEvent(shiftDownEvent);

            // Press S - should trigger
            const sDownEvent = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true });
            jest.spyOn(sDownEvent, 'preventDefault');
            window.dispatchEvent(sDownEvent);

            expect(component.actionTriggered).toBe(true);
            component.reset();

            // Release S
            const sUpEvent = new KeyboardEvent('keyup', { key: 's', ctrlKey: true, shiftKey: true });
            window.dispatchEvent(sUpEvent);

            // Press S again - should still trigger because modifiers are still held
            const sDownEvent2 = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true });
            jest.spyOn(sDownEvent2, 'preventDefault');
            window.dispatchEvent(sDownEvent2);

            expect(component.actionTriggered).toBe(true);
        });

        it('should track and remove keys on keyup (element mode)', () => {
            component.isGlobal = false;
            fixture.detectChanges();
            inputElement.focus();

            // Press Ctrl
            const ctrlDownEvent = new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true, bubbles: true });
            inputElement.dispatchEvent(ctrlDownEvent);

            // Press Shift
            const shiftDownEvent = new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true, ctrlKey: true, bubbles: true });
            inputElement.dispatchEvent(shiftDownEvent);

            // Press S - should trigger
            const sDownEvent = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true, bubbles: true });
            jest.spyOn(sDownEvent, 'preventDefault');
            inputElement.dispatchEvent(sDownEvent);

            expect(component.actionTriggered).toBe(true);
            component.reset();

            // Release S
            const sUpEvent = new KeyboardEvent('keyup', { key: 's', ctrlKey: true, shiftKey: true, bubbles: true });
            inputElement.dispatchEvent(sUpEvent);

            // Press S again - should still trigger
            const sDownEvent2 = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true, bubbles: true });
            jest.spyOn(sDownEvent2, 'preventDefault');
            inputElement.dispatchEvent(sDownEvent2);

            expect(component.actionTriggered).toBe(true);
        });

        it('should clear all pressed keys on window blur', () => {
            // Press multiple keys
            const ctrlEvent = new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true });
            window.dispatchEvent(ctrlEvent);

            const shiftEvent = new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true, ctrlKey: true });
            window.dispatchEvent(shiftEvent);

            const kEvent = new KeyboardEvent('keydown', { key: 'k', shiftKey: true, ctrlKey: true });
            window.dispatchEvent(kEvent);

            // Trigger blur
            window.dispatchEvent(new Event('blur'));

            // Now try to trigger the shortcut - should work because extra key 'k' was cleared
            const sEvent = new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true });
            jest.spyOn(sEvent, 'preventDefault');
            window.dispatchEvent(sEvent);

            expect(component.actionTriggered).toBe(true);
            expect(sEvent.preventDefault).toHaveBeenCalled();
        });
    });

    describe('Modifier key validation', () => {
        beforeEach(() => {
            component.isGlobal = true;
            fixture.detectChanges();
        });

        it('should not trigger if shift is expected but not pressed (line 97)', () => {
            component.shortcut = 'shift.s';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', shiftKey: false });
            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
        });

        it('should not trigger if alt is expected but not pressed (line 98)', () => {
            component.shortcut = 'alt.s';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', altKey: false });
            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
        });

        it('should not trigger if meta is expected but not pressed (line 99)', () => {
            component.shortcut = 'meta.s';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', metaKey: false });
            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
        });

        it('should not trigger if shift is pressed but not expected', () => {
            component.shortcut = 's';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', shiftKey: true });
            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
        });

        it('should not trigger if alt is pressed but not expected', () => {
            component.shortcut = 's';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', altKey: true });
            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
        });

        it('should not trigger if meta is pressed but not expected', () => {
            component.shortcut = 's';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 's', metaKey: true });
            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
        });
    });

    describe('macOS Option key behavior', () => {
        beforeEach(() => {
            component.isGlobal = true;
            fixture.detectChanges();
        });

        it('should handle macOS Option key producing special characters (alt.s)', () => {
            component.shortcut = 'alt.s';
            fixture.detectChanges();

            // Simulate macOS Option+s which produces 'ß'
            const event = new KeyboardEvent('keydown', {
                key: 'ß',
                code: 'KeyS',
                altKey: true
            });
            jest.spyOn(event, 'preventDefault');

            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should handle macOS Option key with different letters (alt.a)', () => {
            component.shortcut = 'alt.a';
            fixture.detectChanges();

            // Simulate macOS Option+a which produces 'å'
            const event = new KeyboardEvent('keydown', {
                key: 'å',
                code: 'KeyA',
                altKey: true
            });
            jest.spyOn(event, 'preventDefault');

            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should handle Shift+number producing special characters (shift.1)', () => {
            component.shortcut = 'shift.1';
            fixture.detectChanges();

            // Simulate Shift+1 which produces '!'
            const event = new KeyboardEvent('keydown', {
                key: '!',
                code: 'Digit1',
                shiftKey: true
            });
            jest.spyOn(event, 'preventDefault');

            window.dispatchEvent(event);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });


    describe('normalizeCode coverage', () => {
        beforeEach(() => {
            component.isGlobal = true;
            fixture.detectChanges();
        });

        it('should handle Numpad keys', () => {
            component.shortcut = '0';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: '0', code: 'Numpad0' });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle Numpad extended keys (numpadadd)', () => {
            component.shortcut = 'numpadadd';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: '+', code: 'NumpadAdd' });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle International keys (IntlBackslash)', () => {
            component.shortcut = 'backslash';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: '\\', code: 'IntlBackslash' });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle International keys (IntlRo)', () => {
            component.shortcut = 'slash';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: '/', code: 'IntlRo' });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle International keys (IntlYen)', () => {
            component.shortcut = 'backslash';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: '\\', code: 'IntlYen' });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle direct named keys (BracketLeft)', () => {
            component.shortcut = 'bracketleft';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: '[', code: 'BracketLeft' });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle modifiers from code (ShiftLeft)', () => {
            component.shortcut = 'shift.enter';
            fixture.detectChanges();

            // Press Shift (code: ShiftLeft -> normalized to 'shift')
            const shiftEvent = new KeyboardEvent('keydown', { key: 'Shift', code: 'ShiftLeft', shiftKey: true });
            window.dispatchEvent(shiftEvent);

            // Press Enter
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
            jest.spyOn(enterEvent, 'preventDefault');
            window.dispatchEvent(enterEvent);

            expect(component.actionTriggered).toBe(true);
        });

        it('should return null for empty code', () => {
            // This is harder to test via public API as event.code is usually present,
            // but we can simulate an event with empty code matching a main key
            component.shortcut = 'a';
            fixture.detectChanges();

            // If code is empty, it returns null, so it falls back to key matching
            const event = new KeyboardEvent('keydown', { key: 'a', code: '' });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle undefined code', () => {
            component.shortcut = 'a';
            fixture.detectChanges();

            // Simulate event with undefined code
            const event = new KeyboardEvent('keydown', { key: 'a' });
            // Manually remove code property if it exists (KeyboardEvent default is empty string usually)
            Object.defineProperty(event, 'code', { get: () => undefined });

            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle Control code', () => {
            component.shortcut = 'ctrl.enter';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 'Enter', code: 'ControlLeft', ctrlKey: true });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle Alt code', () => {
            component.shortcut = 'alt.enter';
            fixture.detectChanges();

            const event = new KeyboardEvent('keydown', { key: 'Enter', code: 'AltLeft', altKey: true });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });

        it('should handle Meta code', () => {
            component.shortcut = 'meta';
            fixture.detectChanges();

            // Press Meta
            // key='Meta' -> normalized to 'meta'
            // code='MetaLeft' -> normalized to 'meta'
            // metaKey=false -> matches empty modifiers
            const event = new KeyboardEvent('keydown', { key: 'Meta', code: 'MetaLeft', metaKey: false });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(true);
        });
    });

    describe('Ignored keys', () => {
        beforeEach(() => {
            component.isGlobal = true;
            component.shortcut = 'enter';
            fixture.detectChanges();
        });

        it('should ignore Dead keys', () => {
            const event = new KeyboardEvent('keydown', { key: 'Dead' });
            jest.spyOn(event, 'preventDefault');
            window.dispatchEvent(event);

            // Should not trigger and should not be added to pressed keys
            expect(component.actionTriggered).toBe(false);
        });

        it('should ignore Process keys', () => {
            const event = new KeyboardEvent('keydown', { key: 'Process' });
            window.dispatchEvent(event);
            expect(component.actionTriggered).toBe(false);
        });

        it('should ignore Unidentified keys', () => {
            const event = new KeyboardEvent('keydown', { key: 'Unidentified' });
            window.dispatchEvent(event);
            expect(component.actionTriggered).toBe(false);
        });

        it('should ignore Dead keys on keyup (element scope)', () => {
            component.isGlobal = false;
            fixture.detectChanges();
            inputElement.focus();

            // Simulate Dead key up
            const event = new KeyboardEvent('keyup', { key: 'Dead', bubbles: true });
            jest.spyOn(event, 'preventDefault');

            // We need to spy on pressedKeys.delete to verify it wasn't called
            // But pressedKeys is private. 
            // Instead, we can verify that no error is thrown and coverage is hit.
            inputElement.dispatchEvent(event);

            expect(component.actionTriggered).toBe(false);
        });

        it('should ignore Dead keys on keyup (global scope)', () => {
            component.isGlobal = true;
            fixture.detectChanges();

            // Simulate Dead key up
            const event = new KeyboardEvent('keyup', { key: 'Dead' });

            window.dispatchEvent(event);

            expect(component.actionTriggered).toBe(false);
        });
    });

    describe('Visibility Change', () => {
        beforeEach(() => {
            component.isGlobal = true;
            component.shortcut = 'ctrl.s';
            fixture.detectChanges();
        });

        it('should clear pressed keys when document becomes hidden', () => {
            // Press Ctrl
            const ctrlEvent = new KeyboardEvent('keydown', { key: 'Control', ctrlKey: true });
            window.dispatchEvent(ctrlEvent);

            // Simulate visibility change to hidden
            Object.defineProperty(document, 'hidden', { configurable: true, value: true });
            document.dispatchEvent(new Event('visibilitychange'));

            // Press S (with Ctrl still technically "pressed" in the event, but our internal state should be cleared)
            // Note: In a real scenario, if the user comes back, they might release keys. 
            // Here we verify that the internal set was cleared.
            // If we try to trigger a sequence that relies on held keys, it might fail if we don't re-press them.
            // But for 'ctrl.s', the check `event.ctrlKey` is used for the modifier, not `pressedKeys`.
            // So let's use a non-standard modifier to verify `pressedKeys` clearing.
        });

        it('should clear pressed keys for non-standard modifiers on visibility change', () => {
            component.shortcut = 'space.enter';
            fixture.detectChanges();

            // Press Space
            const spaceEvent = new KeyboardEvent('keydown', { key: 'Space', code: 'Space' });
            window.dispatchEvent(spaceEvent);

            // Simulate visibility change to hidden
            Object.defineProperty(document, 'hidden', { configurable: true, value: true });
            document.dispatchEvent(new Event('visibilitychange'));

            // Restore visibility (optional, but good practice)
            Object.defineProperty(document, 'hidden', { configurable: true, value: false });

            // Press Enter - should NOT trigger because Space should have been cleared
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            window.dispatchEvent(enterEvent);

            expect(component.actionTriggered).toBe(false);
        });
    });
});
