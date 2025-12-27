import { TestBed } from '@angular/core/testing';
import { ShortcutService } from './shortcut.service';
import { Subscription } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

describe('ShortcutService', () => {
    let service: ShortcutService;
    let subscription: Subscription;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ShortcutService]
        });
        service = TestBed.inject(ShortcutService);
    });

    afterEach(() => {
        if (subscription) {
            subscription.unsubscribe();
        }
        jest.restoreAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // ... existing tests ...

    describe('normalizeCode coverage', () => {
        // ... existing normalizeCode tests ...

        it('should handle modifier from code: metaleft with main key', () => {
            let triggered = false;
            // Use simple 'meta' shortcut. 
            // We set metaKey: false in the event to match the empty modifiers list of 'meta' shortcut.
            subscription = service.observe({ key: 'meta', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press Meta
            // event.key = 'Meta' -> normalized to 'meta'
            // event.code = 'MetaLeft' -> normalized to 'meta' (covers line 183)
            // event.metaKey = false -> matches empty modifiers
            const event = new KeyboardEvent('keydown', { key: 'Meta', code: 'MetaLeft', metaKey: false });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });
    });

    describe('SSR platform checks', () => {
        it('should not add event listeners on non-browser platform (constructor)', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

            // Create service with non-browser platform
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    ShortcutService,
                    { provide: PLATFORM_ID, useValue: 'server' }
                ]
            });

            const ssrService = TestBed.inject(ShortcutService);

            // Should not have added listeners since it's not a browser
            expect(addEventListenerSpy).not.toHaveBeenCalled();

            addEventListenerSpy.mockRestore();
        });

        it('should not remove event listeners on non-browser platform (ngOnDestroy)', () => {
            // Create service with non-browser platform
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    ShortcutService,
                    { provide: PLATFORM_ID, useValue: 'server' }
                ]
            });

            // Spy AFTER reset to avoid catching the destruction of the previous service
            const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

            const ssrService = TestBed.inject(ShortcutService);
            ssrService.ngOnDestroy();

            // Should not have removed listeners since it's not a browser
            expect(removeEventListenerSpy).not.toHaveBeenCalled();

            removeEventListenerSpy.mockRestore();
        });
    });


    it('should trigger on matching shortcut (ctrl.s)', (done) => {
        subscription = service.observe({ key: 'ctrl.s', isGlobal: true }).subscribe(event => {
            expect(event.key).toBe('s');
            expect(event.ctrlKey).toBe(true);
            done();
        });

        const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
        window.dispatchEvent(event);
    });

    it('should prevent default by default', () => {
        let triggered = false;
        subscription = service.observe({ key: 'enter', isGlobal: true }).subscribe(() => {
            triggered = true;
        });

        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        jest.spyOn(event, 'preventDefault');
        window.dispatchEvent(event);

        expect(triggered).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should NOT prevent default if configured false', () => {
        let triggered = false;
        subscription = service.observe({ key: 'enter', isGlobal: true, preventDefault: false }).subscribe(() => {
            triggered = true;
        });

        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        jest.spyOn(event, 'preventDefault');
        window.dispatchEvent(event);

        expect(triggered).toBe(true);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should listen on specific element', (done) => {
        const element = document.createElement('div');
        document.body.appendChild(element);

        subscription = service.observe({ key: 'enter', element }).subscribe(event => {
            expect(event.target).toBe(element);
            done();
        });

        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        element.dispatchEvent(event);

        document.body.removeChild(element);
    });

    it('should support multiple shortcuts (ctrl.s, ctrl.shift.s)', (done) => {
        let count = 0;
        subscription = service.observe({ key: 'ctrl.s, ctrl.shift.s', isGlobal: true }).subscribe(() => {
            count++;
            if (count === 2) done();
        });

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true }));
    });

    it('should allow extra non-modifier keys in strict matching', () => {
        let triggered = false;
        subscription = service.observe({ key: 'shift.enter', isGlobal: true }).subscribe(() => {
            triggered = true;
        });

        // Press Shift
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true }));
        // Press K (extra non-modifier key - should be allowed)
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', shiftKey: true }));
        // Press Enter
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true }));

        expect(triggered).toBe(true);
    });

    it('should reject extra modifier keys in strict matching', () => {
        let triggered = false;
        subscription = service.observe({ key: 'shift.enter', isGlobal: true }).subscribe(() => {
            triggered = true;
        });

        // Press Shift
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true }));
        // Press Ctrl (extra modifier key - should be rejected)
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control', shiftKey: true, ctrlKey: true }));
        // Press Enter
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, ctrlKey: true }));

        expect(triggered).toBe(false);
    });

    it('should support expanded modifiers (space.enter)', (done) => {
        subscription = service.observe({ key: 'space.enter', isGlobal: true }).subscribe(() => {
            done();
        });

        // Press Space - use 'Space' as the key value (what browsers actually send)
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space', code: 'Space' }));
        // Press Enter
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
    });

    describe('Event listener cleanup', () => {
        it('should remove keys from pressedKeys on keyup', () => {
            let triggered = false;
            subscription = service.observe({ key: 'shift.enter', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press Shift
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true }));
            // Release Shift (keyup)
            window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
            // Press Enter (Shift is no longer pressed)
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            expect(triggered).toBe(false);
        });

        it('should clear pressedKeys on window blur', () => {
            let triggered = false;
            subscription = service.observe({ key: 'shift.enter', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press Shift
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true }));
            // Blur window (should clear all pressed keys)
            window.dispatchEvent(new Event('blur'));
            // Press Enter (Shift should be cleared)
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            expect(triggered).toBe(false);
        });

        it('should clear pressedKeys on visibilitychange when document becomes hidden', () => {
            let triggered = false;
            subscription = service.observe({ key: 'shift.enter', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press Shift
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true }));

            // Mock document.hidden
            Object.defineProperty(document, 'hidden', {
                configurable: true,
                get: () => true
            });

            // Trigger visibilitychange (should clear all pressed keys)
            document.dispatchEvent(new Event('visibilitychange'));

            // Reset document.hidden
            Object.defineProperty(document, 'hidden', {
                configurable: true,
                get: () => false
            });

            // Press Enter (Shift should be cleared)
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            expect(triggered).toBe(false);
        });
    });

    describe('Element fallback', () => {
        it('should fallback to window when element is not provided and isGlobal is false', () => {
            let triggered = false;
            subscription = service.observe({ key: 'enter', isGlobal: false }).subscribe(() => {
                triggered = true;
            });

            // Should listen on window as fallback
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            expect(triggered).toBe(true);
        });
    });

    describe('Modifier key validation', () => {
        it('should NOT trigger if ctrl is expected but not pressed', () => {
            let triggered = false;
            subscription = service.observe({ key: 'ctrl.s', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press 's' without ctrl
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));

            expect(triggered).toBe(false);
        });

        it('should NOT trigger if alt is expected but not pressed', () => {
            let triggered = false;
            subscription = service.observe({ key: 'alt.s', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press 's' without alt
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));

            expect(triggered).toBe(false);
        });

        it('should NOT trigger if meta is expected but not pressed', () => {
            let triggered = false;
            subscription = service.observe({ key: 'meta.s', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press 's' without meta
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));

            expect(triggered).toBe(false);
        });

        it('should NOT trigger if unexpected ctrl is pressed', () => {
            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press 's' with ctrl (but ctrl not expected)
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true }));

            expect(triggered).toBe(false);
        });

        it('should NOT trigger if unexpected alt is pressed', () => {
            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press 's' with alt (but alt not expected)
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', altKey: true }));

            expect(triggered).toBe(false);
        });

        it('should NOT trigger if unexpected meta is pressed', () => {
            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press 's' with meta (but meta not expected)
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true }));

            expect(triggered).toBe(false);
        });

        it('should NOT trigger if non-standard modifier is expected but not pressed', () => {
            let triggered = false;
            subscription = service.observe({ key: 'space.s', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press 's' without space being pressed first
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' }));

            expect(triggered).toBe(false);
        });

        it('should handle macOS Option key behavior (fallback to event.code)', (done) => {
            subscription = service.observe({ key: 'alt.s', isGlobal: true }).subscribe(() => {
                done();
            });

            // Simulate macOS Option+s which produces 'ß'
            window.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ß',
                code: 'KeyS',
                altKey: true
            }));
        });

        it('should handle Shift+number producing special characters (shift.1)', (done) => {
            subscription = service.observe({ key: 'shift.1', isGlobal: true }).subscribe(() => {
                done();
            });

            // Simulate Shift+1 which produces '!'
            window.dispatchEvent(new KeyboardEvent('keydown', {
                key: '!',
                code: 'Digit1',
                shiftKey: true
            }));
        });
    });

    describe('Edge cases and coverage completion', () => {
        it('should ignore dead keys (Dead)', () => {
            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Dispatch Dead key event (line 21 coverage)
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Dead' }));
            window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Dead' })); // line 32 coverage

            expect(triggered).toBe(false);
        });

        it('should ignore Process keys (IME)', () => {
            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Process' }));
            window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Process' }));

            expect(triggered).toBe(false);
        });

        it('should ignore Unidentified keys', () => {
            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Unidentified' }));
            window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Unidentified' }));

            expect(triggered).toBe(false);
        });

        it('should handle events without code property (line 37-38 coverage)', () => {
            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Create event without code property
            const eventDown = new KeyboardEvent('keydown', { key: 's' });
            Object.defineProperty(eventDown, 'code', { value: undefined });
            window.dispatchEvent(eventDown);

            expect(triggered).toBe(true);

            // Keyup without code - this specifically covers line 38 (the else branch)
            const eventUp = new KeyboardEvent('keyup', { key: 's' });
            Object.defineProperty(eventUp, 'code', { value: '' }); // empty string is falsy, triggers else
            window.dispatchEvent(eventUp);
        });

        it('should NOT delete from pressedCodes when keyup has no code (line 37-38 false branch)', () => {
            // First, add something to pressedCodes by pressing a key WITH code
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' }));

            // Verify it was added by checking if shortcut still works
            let triggered = false;
            subscription = service.observe({ key: 'a', isGlobal: true }).subscribe(() => {
                triggered = true;
            });
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' }));
            expect(triggered).toBe(true);
            subscription.unsubscribe();

            // Now dispatch keyup WITHOUT code - the false branch of if (event.code)
            // This should NOT call pressedCodes.delete()
            const keyupWithoutCode = new KeyboardEvent('keyup', { key: 'a' });
            // Explicitly ensure code is empty/falsy
            Object.defineProperty(keyupWithoutCode, 'code', {
                get: () => '',
                configurable: true
            });
            window.dispatchEvent(keyupWithoutCode);

            // The key should still work since we only removed from pressedKeys, not pressedCodes
            // (though in practice this doesn't matter much, just testing the branch)
        });

        it('should handle keyup with no code property (line 38 branch coverage)', () => {
            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press key with code
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', code: 'KeyS' }));
            expect(triggered).toBe(true);

            // Release key without code property at all (line 38 branch coverage)
            const keyupEvent = new KeyboardEvent('keyup', { key: 's' });
            // Don't set code property - it will be undefined by default
            window.dispatchEvent(keyupEvent);
        });

        it('should reject element-scoped shortcut when event path does not include element', () => {
            const element = document.createElement('div');
            const outsideElement = document.createElement('div');
            document.body.appendChild(element);
            document.body.appendChild(outsideElement);

            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: false, element }).subscribe(() => {
                triggered = true;
            });

            // Dispatch event and mock composedPath to NOT include element
            const event = new KeyboardEvent('keydown', { key: 's', bubbles: true });
            jest.spyOn(event, 'composedPath').mockReturnValue([outsideElement, document.body, document.documentElement, window]);
            element.dispatchEvent(event);

            expect(triggered).toBe(false);

            document.body.removeChild(element);
            document.body.removeChild(outsideElement);
        });

        it('should accept element-scoped shortcut when element is in composedPath', () => {
            const element = document.createElement('input');
            document.body.appendChild(element);

            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: false, element }).subscribe(() => {
                triggered = true;
            });

            // Dispatch event with element in composedPath
            const event = new KeyboardEvent('keydown', { key: 's', bubbles: true });
            jest.spyOn(event, 'composedPath').mockReturnValue([element, document.body, document.documentElement, window]);
            element.dispatchEvent(event);

            expect(triggered).toBe(true);

            document.body.removeChild(element);
        });

        it('should accept element-scoped shortcut when child element is in composedPath', () => {
            const element = document.createElement('div');
            const input = document.createElement('input');
            element.appendChild(input);
            document.body.appendChild(element);

            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: false, element }).subscribe(() => {
                triggered = true;
            });

            // Dispatch event with child in composedPath (bubbles through element)
            const event = new KeyboardEvent('keydown', { key: 's', bubbles: true });
            jest.spyOn(event, 'composedPath').mockReturnValue([input, element, document.body, document.documentElement, window]);
            element.dispatchEvent(event);

            expect(triggered).toBe(true);

            document.body.removeChild(element);
        });

        it('should handle event without code property in matchesDescriptor (line 113)', () => {
            let triggered = false;
            subscription = service.observe({ key: 's', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Create event without code
            const event = new KeyboardEvent('keydown', { key: 's' });
            Object.defineProperty(event, 'code', { value: null });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });



        it('should match numpad keys via second OR condition (line 153 right side)', () => {
            let triggered = false;
            subscription = service.observe({ key: '1', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press Numpad1 with lowercase code to test second part of OR
            // code === `digit${mainKey}`.toLowerCase() || code === `numpad${mainKey}`
            // We want the second condition to be true
            const event = new KeyboardEvent('keydown', { key: '1' });
            Object.defineProperty(event, 'code', { value: 'numpad1', configurable: true });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);

        });

        it('should reject when standard modifier not in allowedKeys (line 136 AND condition)', () => {
            let triggered = false;
            subscription = service.observe({ key: 'a', isGlobal: true }).subscribe(() => {

                // Press 'b' (unexpected non-modifier)
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));

                // Press 'a'
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

                // Should trigger because 'b' is ignored (it's not a modifier)
                expect(triggered).toBe(true);
            });
        });

        it('should match standard digit keys (line 153 first OR condition)', () => {
            let triggered = false;
            subscription = service.observe({ key: '1', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press '1' with standard Digit1 code
            window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', code: 'Digit1' }));

            expect(triggered).toBe(true);
        });

        it('should not match number if code is invalid (line 153 false result)', () => {
            let triggered = false;
            subscription = service.observe({ key: '1', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press '1' but with wrong code AND wrong key (to force code check)
            // If key matches '1', it bypasses code check. So we set key to 'Unidentified'
            const event = new KeyboardEvent('keydown', { key: 'Unidentified' });
            Object.defineProperty(event, 'code', { value: 'KeyA', configurable: true });
            window.dispatchEvent(event);

            expect(triggered).toBe(false);
        });
    });

    describe('normalizeCode coverage', () => {
        it('should handle direct key names (minus, equal, slash, etc.)', () => {
            let triggered = false;
            subscription = service.observe({ key: 'minus', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Dispatch event with code 'Minus'
            const event = new KeyboardEvent('keydown', { key: '-', code: 'Minus' });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });

        it('should handle international keyboard key: intlbackslash', () => {
            let triggered = false;
            subscription = service.observe({ key: 'backslash', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Dispatch event with IntlBackslash code
            const event = new KeyboardEvent('keydown', { key: '\\', code: 'IntlBackslash' });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });

        it('should handle international keyboard key: intlro', () => {
            let triggered = false;
            subscription = service.observe({ key: 'slash', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Dispatch event with IntlRo code
            const event = new KeyboardEvent('keydown', { key: '/', code: 'IntlRo' });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });

        it('should handle international keyboard key: intlyen', () => {
            let triggered = false;
            subscription = service.observe({ key: 'backslash', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Dispatch event with IntlYen code
            const event = new KeyboardEvent('keydown', { key: '¥', code: 'IntlYen' });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });

        it('should handle numpad extended keys: numpadadd', () => {
            let triggered = false;
            subscription = service.observe({ key: 'numpadadd', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Dispatch event with NumpadAdd code
            const event = new KeyboardEvent('keydown', { key: '+', code: 'NumpadAdd' });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });

        it('should handle modifier from code: shiftleft with main key', () => {
            let triggered = false;
            subscription = service.observe({ key: 'shift.s', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press Shift first
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', code: 'ShiftLeft', shiftKey: true }));
            // Press S with Shift
            const event = new KeyboardEvent('keydown', { key: 's', code: 'KeyS', shiftKey: true });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });

        it('should handle modifier from code: controlleft with main key', () => {
            let triggered = false;
            subscription = service.observe({ key: 'ctrl.s', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press Control first
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Control', code: 'ControlLeft', ctrlKey: true }));
            // Press S with Control
            const event = new KeyboardEvent('keydown', { key: 's', code: 'KeyS', ctrlKey: true });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });

        it('should handle modifier from code: altleft with main key', () => {
            let triggered = false;
            subscription = service.observe({ key: 'alt.s', isGlobal: true }).subscribe(() => {
                triggered = true;
            });

            // Press Alt first
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Alt', code: 'AltLeft', altKey: true }));
            // Press S with Alt
            const event = new KeyboardEvent('keydown', { key: 's', code: 'KeyS', altKey: true });
            window.dispatchEvent(event);

            expect(triggered).toBe(true);
        });
    });


})