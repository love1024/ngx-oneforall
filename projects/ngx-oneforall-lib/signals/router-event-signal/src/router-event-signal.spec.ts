import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, NavigationStart, NavigationEnd, RouterEvent, Event } from '@angular/router';
import { Subject } from 'rxjs';
import { routerEventSignal } from './router-event-signal';

describe('routerEventSignal', () => {
    let events$: Subject<Event>;
    let mockRouter: any;

    beforeEach(() => {
        events$ = new Subject<Event>();
        mockRouter = {
            events: events$.asObservable()
        };

        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useValue: mockRouter }
            ]
        });
    });

    it('should create with initial null value', () => {
        TestBed.runInInjectionContext(() => {
            const s = routerEventSignal();
            expect(s.event()).toBeNull();
            expect(s.isNavigationStart()).toBe(false);
            expect(s.isNavigationEnd()).toBe(false);
        });
    });

    it('should update on NavigationStart', () => {
        TestBed.runInInjectionContext(() => {
            const s = routerEventSignal();
            const event = new NavigationStart(1, '/test');

            events$.next(event);

            expect(s.event()).toBe(event);
            expect(s.isNavigationStart()).toBe(true);
            expect(s.isNavigationEnd()).toBe(false);
        });
    });

    it('should update on NavigationEnd', () => {
        TestBed.runInInjectionContext(() => {
            const s = routerEventSignal();
            const event = new NavigationEnd(1, '/test', '/test');

            events$.next(event);

            expect(s.event()).toBe(event);
            expect(s.isNavigationStart()).toBe(false);
            expect(s.isNavigationEnd()).toBe(true);
        });
    });

    it('should ignore non-RouterEvent events', () => {
        TestBed.runInInjectionContext(() => {
            const s = routerEventSignal();
            // Emitting a generic Event that is NOT a RouterEvent (if possible in types, or just cast)
            // The filter checks `e instanceof RouterEvent`.
            // NavigationStart IS a RouterEvent.
            // Let's try to emit something that satisfies the Event type but isn't RouterEvent if possible,
            // or just verify it handles RouterEvents correctly.
            // Actually, in Angular, Router.events emits `Event`. `RouterEvent` is a subclass.
            // Let's create a fake class extending Event but not RouterEvent? 
            // Or just rely on the fact that we only emit RouterEvents in tests usually.
            // But the code has `filter((e): e is RouterEvent => e instanceof RouterEvent)`.

            // Let's try to emit a plain object cast as Event if we want to test the filter, 
            // but `instanceof` check might fail if it's not a class instance.

            class CustomEvent { id = 1; url = '/'; }
            events$.next(new CustomEvent() as any);

            expect(s.event()).toBeNull();
        });
    });

    it('should clean up subscription on destroy', () => {
        @Component({ template: '', standalone: true })
        class TestComponent {
            s = routerEventSignal();
        }

        const fixture = TestBed.createComponent(TestComponent);
        const component = fixture.componentInstance;

        // Spy on unsubscribe
        // We can't easily spy on the inner subscription unsubscribe without mocking Observable.subscribe.
        // But we can verify that after destroy, new events don't update the signal.

        const event1 = new NavigationStart(1, '/1');
        events$.next(event1);
        expect(component.s.event()).toBe(event1);

        fixture.destroy();

        const event2 = new NavigationStart(2, '/2');
        events$.next(event2);

        // Should still be event1
        expect(component.s.event()).toBe(event1);
    });
});
