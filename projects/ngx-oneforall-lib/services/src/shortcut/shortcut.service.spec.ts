import { TestBed } from '@angular/core/testing';
import { ShortcutService } from './shortcut.service';
import { Subscription } from 'rxjs';

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

    it('should enforce strict matching', () => {
        let triggered = false;
        subscription = service.observe({ key: 'shift.enter', isGlobal: true }).subscribe(() => {
            triggered = true;
        });

        // Press Shift
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', shiftKey: true }));
        // Press K (extra key)
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', shiftKey: true }));
        // Press Enter
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true }));

        expect(triggered).toBe(false);
    });

    it('should support expanded modifiers (space.enter)', (done) => {
        subscription = service.observe({ key: 'space.enter', isGlobal: true }).subscribe(() => {
            done();
        });

        // Press Space
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }));
        // Press Enter
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
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
    });
});
