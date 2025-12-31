import { Component, EnvironmentInjector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  VisibilityChangeDirective,
  VisibilityChange,
} from './visibility-change.directive';

@Component({
  template: `<div
    visibilityChange
    (visibilityChange)="onVisibilityChange($event)"></div>`,
  imports: [VisibilityChangeDirective],
})
class TestHostComponent {
  event: VisibilityChange | null = null;
  onVisibilityChange(event: VisibilityChange) {
    this.event = event;
  }
}

describe('VisibilityChangeDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let hostEl: HTMLElement;
  let directive: VisibilityChangeDirective;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    // Mock IntersectionObserver
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).IntersectionObserver = jest.fn(function (cb) {
      observerCallback = cb;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    TestBed.configureTestingModule({
      imports: [TestHostComponent, VisibilityChangeDirective],
      providers: [EnvironmentInjector],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    hostEl = fixture.nativeElement.querySelector('div');
    directive = fixture.debugElement.children[0].injector.get(
      VisibilityChangeDirective
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should observe the host element on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((window as any).IntersectionObserver).toHaveBeenCalled();
  });

  it('should emit visibilityChange when visibility changes to visible', () => {
    const entry = {
      isIntersecting: true,
      target: hostEl,
    } as unknown as IntersectionObserverEntry;

    observerCallback([entry], {} as IntersectionObserver);

    expect(component.event).toEqual({
      isVisible: true,
      target: hostEl,
    });
  });

  it('should emit visibilityChange when visibility changes to not visible', () => {
    // First, set to visible
    observerCallback(
      [
        {
          isIntersecting: true,
          target: hostEl,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    );

    // Then, set to not visible
    observerCallback(
      [
        {
          isIntersecting: false,
          target: hostEl,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    );

    expect(component.event).toEqual({
      isVisible: false,
      target: hostEl,
    });
  });

  it('should emit isVisible: false and target: undefined on destroy', () => {
    const emitSpy = jest.spyOn(directive.visibilityChange, 'emit');
    directive.ngOnDestroy();
    expect(emitSpy).toHaveBeenCalledWith({
      isVisible: false,
      target: undefined,
    });
  });

  it('should disconnect observer on destroy', () => {
    const disconnectSpy = jest.fn();
    directive['observer'] = {
      disconnect: disconnectSpy,
    } as unknown as IntersectionObserver;
    directive.ngOnDestroy();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should NOT emit when visibility has not changed (else branch line 79)', () => {
    // First, set to visible
    const entry = {
      isIntersecting: true,
      target: hostEl,
    } as unknown as IntersectionObserverEntry;

    observerCallback([entry], {} as IntersectionObserver);
    expect(component.event?.isVisible).toBe(true);

    // Reset event tracking
    const emitSpy = jest.spyOn(directive.visibilityChange, 'emit');
    emitSpy.mockClear();

    // Fire callback again with same visibility (isIntersecting: true again)
    observerCallback([entry], {} as IntersectionObserver);

    // Should NOT emit since visibility hasn't changed
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
