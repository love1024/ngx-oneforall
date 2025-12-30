/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/prefer-inject */
import {
  Component,
  ElementRef,
  Signal,
  signal,
  WritableSignal,
  PLATFORM_ID,
} from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { eventSignal } from './event-signal';

@Component({
  template: ``,
  standalone: true,
})
class TestComponent {
  constructor(public elementRef: ElementRef) {}
}

describe('eventSignal', () => {
  it('should create a signal with initial value null', () => {
    const target = document.createElement('div');
    TestBed.runInInjectionContext(() => {
      const s = eventSignal(target, 'click');
      expect(s()).toBeNull();
    });
  });

  it('should update signal value on event', () => {
    const target = document.createElement('div');
    let s: Signal<Event | null>;

    TestBed.runInInjectionContext(() => {
      s = eventSignal(target, 'click');
    });

    target.dispatchEvent(new Event('click'));

    expect(s!()).toBeInstanceOf(Event);
    expect(s!()?.type).toBe('click');
  });

  it('should support options', () => {
    const target = document.createElement('div');
    const addSpy = jest.spyOn(target, 'addEventListener');

    TestBed.runInInjectionContext(() => {
      eventSignal(target, 'click', { capture: true });
    });

    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), {
      capture: true,
    });
  });

  it('should clean up event listener on destroy', () => {
    @Component({ template: '', standalone: true })
    class CleanupComponent {
      s: any;
      constructor(public elementRef: ElementRef) {
        this.s = eventSignal(this.elementRef.nativeElement, 'click');
      }
    }

    TestBed.configureTestingModule({ imports: [CleanupComponent] });
    const fixture = TestBed.createComponent(CleanupComponent);
    const element = fixture.componentInstance.elementRef.nativeElement;
    const removeSpy = jest.spyOn(element, 'removeEventListener');

    fixture.detectChanges(); // Initialize
    fixture.destroy(); // Destroy

    expect(removeSpy).toHaveBeenCalled();
  });

  it('should not attach listener on server (SSR)', () => {
    const target = document.createElement('div');
    const addSpy = jest.spyOn(target, 'addEventListener');

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    TestBed.runInInjectionContext(() => {
      const s = eventSignal(target, 'click');
      expect(s()).toBeNull();
    });

    expect(addSpy).not.toHaveBeenCalled();
  });
});
