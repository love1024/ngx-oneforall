import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { intervalSignal, IntervalController } from './interval-signal';

describe('intervalSignal', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should create with initial values', () => {
        TestBed.runInInjectionContext(() => {
            const s = intervalSignal(1000);
            expect(s.value()).toBe(0);
            expect(s.running()).toBe(false);
        });
    });

    it('should start incrementing value', () => {
        TestBed.runInInjectionContext(() => {
            const s = intervalSignal(1000);
            s.start();
            expect(s.running()).toBe(true);

            jest.advanceTimersByTime(1000);
            expect(s.value()).toBe(1);

            jest.advanceTimersByTime(2000);
            expect(s.value()).toBe(3);
        });
    });

    it('should stop incrementing value', () => {
        TestBed.runInInjectionContext(() => {
            const s = intervalSignal(1000);
            s.start();
            jest.advanceTimersByTime(1000);
            expect(s.value()).toBe(1);

            s.stop();
            expect(s.running()).toBe(false);

            jest.advanceTimersByTime(5000);
            expect(s.value()).toBe(1); // Should not change
        });
    });

    it('should not start if already running', () => {
        TestBed.runInInjectionContext(() => {
            const s = intervalSignal(1000);
            s.start();

            // Spy on setInterval to ensure it's not called again
            const spy = jest.spyOn(global, 'setInterval');
            s.start();

            // Note: setInterval was called once on first start. 
            // Since we are inside the same test, we'd expect 1 call total if logic is correct.
            // However, jest.spyOn might miss the first one if called after.
            // Let's rely on behavior: if it started again, we might see double increments or issues.
            // Better: check internal state if possible, or trust the coverage.
            // The implementation checks `if (running()) return;`.

            // Let's verify value increment is consistent (not double speed)
            jest.advanceTimersByTime(1000);
            expect(s.value()).toBe(1);
        });
    });

    it('should clean up on destroy', () => {
        @Component({ template: '', standalone: true })
        class TestComponent {
            s: IntervalController;
            constructor() {
                this.s = intervalSignal(1000);
                this.s.start();
            }
        }

        const fixture = TestBed.createComponent(TestComponent);
        const component = fixture.componentInstance;

        expect(component.s.running()).toBe(true);

        fixture.destroy();

        // Should be stopped
        expect(component.s.running()).toBe(false);

        const val = component.s.value();
        jest.advanceTimersByTime(2000);
        expect(component.s.value()).toBe(val);
    });
});
