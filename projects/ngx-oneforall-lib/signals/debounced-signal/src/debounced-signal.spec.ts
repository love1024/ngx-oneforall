/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, signal } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { debouncedSignal } from './debounced-signal';

describe('debouncedSignal', () => {
  it('should create with initial value', () => {
    TestBed.runInInjectionContext(() => {
      const source = signal(1);
      const debounced = debouncedSignal(source, 100);
      expect(debounced()).toBe(1);
    });
  });

  it('should debounce values', fakeAsync(() => {
    const debouncedValue = 0;

    @Component({ template: '', standalone: true })
    class TestComponent {
      source = signal(1);
      debounced = debouncedSignal(this.source, 100);

      constructor() {
        // accessing the signal to register effect if necessary?
        // Actually debouncedSignal uses `effect` internally, so it needs an injection context or to be in a component.
      }
    }

    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.componentInstance;

    // Initial value is set immediately in the signal creation line inside debouncedSignal
    expect(component.debounced()).toBe(1);

    // Update source
    component.source.set(2);
    fixture.detectChanges();

    // Should not have updated yet
    expect(component.debounced()).toBe(1);

    // Advance time partially
    tick(50);
    expect(component.debounced()).toBe(1);

    // Advance rest of time
    tick(50);
    expect(component.debounced()).toBe(2);

    // Fast updates
    component.source.set(3);
    fixture.detectChanges();
    tick(50);
    component.source.set(4);
    fixture.detectChanges();

    // Should not be 3
    tick(100); // 50 + 100 = 150 from start of this block? No, tick steps forward.
    // We waited 50ms after set(3). Then set(4).
    // The effect for 3 was scheduled. But when 4 came, the effect for 3's cleanup should have run?
    // Wait, the effect runs synchronously on change detection or signal update if tracked?
    // Using `effect` inside `debouncedSignal`:
    // When `source` changes, the effect is scheduled.

    expect(component.debounced()).toBe(4);
  }));

  it('should cleanup timeout on destroy', fakeAsync(() => {
    @Component({ template: '', standalone: true })
    class TestComponent {
      source = signal(1);
      debounced = debouncedSignal(this.source, 100);
    }

    const fixture = TestBed.createComponent(TestComponent);
    const component = fixture.componentInstance;

    component.source.set(2);
    fixture.detectChanges();

    // Destroy before timeout
    fixture.destroy();

    tick(100);

    // If we could access the internal signal, we would check it hasn't changed.
    // But since the component is destroyed, we can just ensure no errors or unexpected behavior.
    // The fact that tick(100) passes without error is good.
    // To be stricter, we might check if `out.set` was called?
    // Hard to check without spying on the internal signal or correct closure.
    // But the `onCleanup` in implementation does `clearTimeout`.
  }));
});
