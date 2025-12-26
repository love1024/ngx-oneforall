import { Component, signal } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { throttledSignal } from './throttled-signal';

describe('throttledSignal', () => {
    it('should create with initial value', () => {
        TestBed.runInInjectionContext(() => {
            const source = signal(1);
            const throttled = throttledSignal(source, 100);
            expect(throttled()).toBe(1);
        });
    });

    it('should throttle values', fakeAsync(() => {
        @Component({ template: '', standalone: true })
        class TestComponent {
            source = signal(1);
            throttled = throttledSignal(this.source, 100);
        }

        const fixture = TestBed.createComponent(TestComponent);
        const component = fixture.componentInstance;

        expect(component.throttled()).toBe(1);

        // First update immediate (leading edge behavior in typical throttle, 
        // but implementation checks `remaining <= 0`. `lastEmit` init 0.
        // Date.now() is large. remaining < 0. So first update is immediate.

        // Wait a bit to ensure we are "fresh" if needed, 
        // though virtual time starts at 0? 
        // Jest/Jasmine fakeAsync mocks Date.now? Usually yes.

        tick(1);

        component.source.set(2);
        fixture.detectChanges();

        // Should update immediately because it's the first change after init 
        // AND assumption is `lastEmit` was 0 (epoch) and now is > 0.
        // BUT `effect` runs initially.
        // Init: source=1. effect runs. `lastEmit` = now. out.set(1).
        // Then we wait 1ms.
        // set(2). effect runs. remaining = 100 - (now - lastEmit) = 100 - 1 = 99.
        // remaining > 0. So setTimeout scheduled for 99ms.

        expect(component.throttled()).toBe(1); // Should NOT have updated yet

        tick(50);
        expect(component.throttled()).toBe(1);

        tick(50); // Total 100ms passed since set(2)
        expect(component.throttled()).toBe(2);

    }));

    it('should update immediately if delay has passed', fakeAsync(() => {
        @Component({ template: '', standalone: true })
        class TestComponent {
            source = signal(1);
            throttled = throttledSignal(this.source, 100);
        }

        const fixture = TestBed.createComponent(TestComponent);
        const component = fixture.componentInstance;

        // Init effect ran at t=0. lastEmit=0.

        tick(150);
        // t=150.

        component.source.set(2);
        fixture.detectChanges();

        // remaining = 100 - (150 - 0) = -50. <= 0.
        // Should update immediately.

        expect(component.throttled()).toBe(2);
    }));

    it('should update only once at trailing edge for multiple updates', fakeAsync(() => {
        @Component({ template: '', standalone: true })
        class TestComponent {
            source = signal(1);
            throttled = throttledSignal(this.source, 100);
        }

        const fixture = TestBed.createComponent(TestComponent);
        const component = fixture.componentInstance;

        // t=0. lastEmit=0.

        tick(10);
        // t=10.
        component.source.set(2);
        fixture.detectChanges();
        // remaining=90. scheduled for +90 (t=100).

        tick(10);
        // t=20.
        component.source.set(3);
        fixture.detectChanges();
        // remaining=80 (relative to 10? no relative to now).
        // Wait. effect implementation:
        // const remaining = delay - (now - lastEmit);
        // lastEmit is still 0! It only updates when we actually emit.
        // So remaining = 100 - (20 - 0) = 80.
        // It clears previous timeout.
        // Schedules new timeout for 80ms. Target t=100.

        expect(component.throttled()).toBe(1);

        tick(80);
        // t=100. Timeout fires.

        expect(component.throttled()).toBe(3);
    }));
});
