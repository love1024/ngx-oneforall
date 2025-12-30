import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { ResizedDirective } from './resized.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div resized></div>`,
  standalone: true,
  imports: [ResizedDirective],
})
class TestHostComponent {}

describe('ResizedDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let elementRef: DebugElement;
  let directive: ResizedDirective;
  const mockResizeObserver: jest.Mocked<ResizeObserver> = {
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  } as unknown as jest.Mocked<ResizeObserver>;

  let emitSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResizedDirective, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);

    elementRef = fixture.debugElement.query(By.directive(ResizedDirective));
    directive = elementRef.injector.get(ResizedDirective);

    emitSpy = jest.spyOn(directive.resized, 'emit');

    // Mock ResizeObserver globally
    global.ResizeObserver = jest.fn().mockImplementation(cb => {
      cb([]);
      return mockResizeObserver;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize ResizeObserver and observe the element', () => {
    fixture.detectChanges();
    expect(mockResizeObserver.observe).toHaveBeenCalledWith(
      elementRef.nativeElement
    );
  });

  it('should emit resized event on size change', () => {
    const mockEntry = {
      contentRect: { width: 100, height: 100 } as DOMRectReadOnly,
    } as ResizeObserverEntry;

    global.ResizeObserver = jest.fn().mockImplementation(cb => {
      cb([mockEntry]);
      return mockResizeObserver;
    });

    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith({
      current: mockEntry.contentRect,
      previous: null,
    });
  });

  it('should update previousRect after emitting resized event', () => {
    const mockEntry1 = {
      contentRect: { width: 100, height: 100 } as DOMRectReadOnly,
    } as ResizeObserverEntry;

    const mockEntry2 = {
      contentRect: { width: 200, height: 200 } as DOMRectReadOnly,
    } as ResizeObserverEntry;

    global.ResizeObserver = jest.fn().mockImplementation(cb => {
      cb([mockEntry1]);
      cb([mockEntry2]);
      return mockResizeObserver;
    });

    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith({
      current: mockEntry2.contentRect,
      previous: mockEntry1.contentRect,
    });
  });

  it('should disconnect ResizeObserver on destroy', () => {
    fixture.detectChanges();

    fixture.destroy();
    expect(mockResizeObserver.disconnect).toHaveBeenCalled();
  });
  it('should not emit resized event if entries length is 0', () => {
    directive['handleResize']([]);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should debounce resize events when debounceTime is set', () => {
    jest.useFakeTimers();

    const mockEntry1 = {
      contentRect: { width: 100, height: 100 } as DOMRectReadOnly,
    } as ResizeObserverEntry;

    const mockEntry2 = {
      contentRect: { width: 200, height: 200 } as DOMRectReadOnly,
    } as ResizeObserverEntry;

    // Set debounce time
    (directive as unknown as { debounceTime: () => number }).debounceTime =
      () => 100;

    fixture.detectChanges();

    // Simulate rapid resize events
    directive['handleResize']([mockEntry1]);
    directive['handleResize']([mockEntry2]);

    // Should not emit yet
    expect(emitSpy).not.toHaveBeenCalled();

    // Advance timer
    jest.advanceTimersByTime(100);

    // Should emit only the last value
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith({
      current: mockEntry2.contentRect,
      previous: null,
    });

    jest.useRealTimers();
  });

  it('should clear debounce timer on destroy', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const mockEntry = {
      contentRect: { width: 100, height: 100 } as DOMRectReadOnly,
    } as ResizeObserverEntry;

    // Set debounce time
    (directive as unknown as { debounceTime: () => number }).debounceTime =
      () => 100;

    fixture.detectChanges();

    // Trigger resize to start debounce timer
    directive['handleResize']([mockEntry]);

    // Destroy before timer completes
    fixture.destroy();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
