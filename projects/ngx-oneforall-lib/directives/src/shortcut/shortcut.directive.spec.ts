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

        it('should NOT trigger when element is not focused', () => {
            // Don't focus the element
            const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });

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

        it('should not trigger if extra keys are pressed', () => {
            // Simulate pressing Shift
            const shiftEvent = new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true });
            window.dispatchEvent(shiftEvent);

            // Simulate pressing K (extra key)
            const kEvent = new KeyboardEvent('keydown', { key: 'k', shiftKey: true });
            window.dispatchEvent(kEvent);

            // Simulate pressing Enter
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
            jest.spyOn(enterEvent, 'preventDefault');

            window.dispatchEvent(enterEvent);
            fixture.detectChanges();

            expect(component.actionTriggered).toBe(false);
            expect(enterEvent.preventDefault).not.toHaveBeenCalled();
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

            // Press Space
            const spaceEvent = new KeyboardEvent('keydown', { key: ' ', code: 'Space' });
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
});
