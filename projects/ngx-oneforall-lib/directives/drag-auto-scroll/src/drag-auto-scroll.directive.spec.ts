import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { DragAutoScrollDirective } from './drag-auto-scroll.directive';

function createDragEvent(
  type: string,
  clientX: number,
  clientY: number
): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clientX', { value: clientX });
  Object.defineProperty(event, 'clientY', { value: clientY });
  return event;
}

describe('DragAutoScrollDirective', () => {
  @Component({
    imports: [DragAutoScrollDirective],
    template: `<div
      dragAutoScroll
      style="overflow-y: auto; height: 200px"></div>`,
  })
  class TestHostComponent {}

  let fixture: ComponentFixture<TestHostComponent>;
  let hostEl: HTMLElement;
  let doc: Document;
  let rafCallback: FrameRequestCallback | null = null;
  let rafId = 1;

  beforeEach(() => {
    rafCallback = null;
    rafId = 1;

    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        rafCallback = cb;
        return rafId++;
      });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
      rafCallback = null;
    });

    TestBed.configureTestingModule({
      imports: [TestHostComponent, DragAutoScrollDirective],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    doc = TestBed.inject(DOCUMENT);
    hostEl = fixture.debugElement.query(
      By.directive(DragAutoScrollDirective)
    ).nativeElement;

    // Container at (0,0) to (300,200)
    jest.spyOn(hostEl, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 200,
      left: 0,
      right: 300,
      width: 300,
      height: 200,
      x: 0,
      y: 0,
      toJSON() {
        return this;
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the directive', () => {
    const directive = fixture.debugElement.query(
      By.directive(DragAutoScrollDirective)
    );
    expect(directive).toBeTruthy();
  });

  it('should scroll down when dragging near the bottom edge', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 180));

    expect(window.requestAnimationFrame).toHaveBeenCalled();

    hostEl.scrollTop = 0;
    rafCallback!(0);
    expect(hostEl.scrollTop).toBeGreaterThan(0);
  });

  it('should scroll up when dragging near the top edge', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 10));

    expect(window.requestAnimationFrame).toHaveBeenCalled();

    hostEl.scrollTop = 100;
    rafCallback!(0);
    expect(hostEl.scrollTop).toBeLessThan(100);
  });

  it('should stop scrolling on drop', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 180));
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    doc.dispatchEvent(createDragEvent('drop', 150, 180));
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should stop scrolling on dragend', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 180));
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    doc.dispatchEvent(createDragEvent('dragend', 150, 180));
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should not scroll when cursor is in the center', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 100));
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should zero speed but keep loop alive when cursor moves to center', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 180));
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    doc.dispatchEvent(createDragEvent('dragover', 150, 100));
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
    hostEl.scrollTop = 50;
    rafCallback!(0);
    expect(hostEl.scrollTop).toBe(50);
  });

  it('should not start a second rAF loop if already scrolling', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 180));
    const callCount = (window.requestAnimationFrame as jest.Mock).mock.calls
      .length;

    doc.dispatchEvent(createDragEvent('dragover', 150, 185));
    expect((window.requestAnimationFrame as jest.Mock).mock.calls.length).toBe(
      callCount
    );
  });

  it('should scale scroll speed proportionally to cursor proximity', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 195));
    hostEl.scrollTop = 0;
    rafCallback!(0);
    const fastScroll = hostEl.scrollTop;

    doc.dispatchEvent(createDragEvent('drop', 150, 0));
    (window.requestAnimationFrame as jest.Mock).mockClear();
    (window.cancelAnimationFrame as jest.Mock).mockClear();
    rafId = 100;

    doc.dispatchEvent(createDragEvent('dragover', 150, 160));
    hostEl.scrollTop = 0;
    rafCallback!(0);
    const slowScroll = hostEl.scrollTop;

    expect(fastScroll).toBeGreaterThan(slowScroll);
  });

  it('should stop scrolling when cursor is horizontally outside tolerance', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 180));
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    doc.dispatchEvent(createDragEvent('dragover', -60, 180));
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should stop scrolling when cursor is horizontally past the right tolerance', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 180));
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    doc.dispatchEvent(createDragEvent('dragover', 360, 180));
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should ignore dragover at (0,0) to keep scrolling when cursor leaves window', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 180));
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    // Chrome fires (0,0) when cursor leaves browser window — should be ignored
    doc.dispatchEvent(createDragEvent('dragover', 0, 0));
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
  });

  it('should clean up document listeners and animation frame on destroy', () => {
    const removeListenerSpy = jest.spyOn(doc, 'removeEventListener');

    doc.dispatchEvent(createDragEvent('dragover', 150, 180));

    fixture.destroy();

    expect(removeListenerSpy).toHaveBeenCalledWith(
      'dragover',
      expect.any(Function)
    );
    expect(removeListenerSpy).toHaveBeenCalledWith(
      'drop',
      expect.any(Function)
    );
    expect(removeListenerSpy).toHaveBeenCalledWith(
      'dragend',
      expect.any(Function)
    );
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should clean up without error when destroyed before init', () => {
    const earlyFixture = TestBed.createComponent(TestHostComponent);
    expect(() => earlyFixture.destroy()).not.toThrow();
  });

  it('should scroll up when container top is above viewport and cursor near screen top', () => {
    jest.spyOn(hostEl, 'getBoundingClientRect').mockReturnValue({
      top: -200,
      bottom: 400,
      left: 0,
      right: 300,
      width: 300,
      height: 600,
      x: 0,
      y: -200,
      toJSON() {
        return this;
      },
    });

    doc.dispatchEvent(createDragEvent('dragover', 150, 10));
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    hostEl.scrollTop = 100;
    rafCallback!(0);
    expect(hostEl.scrollTop).toBeLessThan(100);
  });

  it('should scroll down when container bottom is below viewport and cursor near screen bottom', () => {
    jest.spyOn(hostEl, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 1200,
      left: 0,
      right: 300,
      width: 300,
      height: 1100,
      x: 0,
      y: 100,
      toJSON() {
        return this;
      },
    });

    doc.dispatchEvent(createDragEvent('dragover', 150, 750));
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    hostEl.scrollTop = 0;
    rafCallback!(0);
    expect(hostEl.scrollTop).toBeGreaterThan(0);
  });

  it('should not call cancelAnimationFrame if not scrolling on destroy', () => {
    (window.cancelAnimationFrame as jest.Mock).mockClear();
    fixture.destroy();
    expect(window.cancelAnimationFrame).not.toHaveBeenCalled();
  });

  it('should fall back to rect.bottom when defaultView is null', () => {
    Object.defineProperty(doc, 'defaultView', {
      value: null,
      configurable: true,
    });

    doc.dispatchEvent(createDragEvent('dragover', 150, 180));
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    Object.defineProperty(doc, 'defaultView', {
      value: window,
      configurable: true,
    });
  });
});

describe('DragAutoScrollDirective (disabled)', () => {
  @Component({
    imports: [DragAutoScrollDirective],
    template: `<div
      dragAutoScroll
      [dragAutoScrollDisabled]="true"
      style="overflow-y: auto; height: 200px"></div>`,
  })
  class DisabledHostComponent {}

  let fixture: ComponentFixture<DisabledHostComponent>;
  let doc: Document;
  let hostEl: HTMLElement;

  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
      // noop
    });

    TestBed.configureTestingModule({
      imports: [DisabledHostComponent, DragAutoScrollDirective],
    });
    fixture = TestBed.createComponent(DisabledHostComponent);
    fixture.detectChanges();
    doc = TestBed.inject(DOCUMENT);
    hostEl = fixture.debugElement.query(
      By.directive(DragAutoScrollDirective)
    ).nativeElement;

    jest.spyOn(hostEl, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 200,
      left: 0,
      right: 300,
      width: 300,
      height: 200,
      x: 0,
      y: 0,
      toJSON() {
        return this;
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not scroll when disabled', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 180));
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });
});

describe('DragAutoScrollDirective (custom config)', () => {
  @Component({
    imports: [DragAutoScrollDirective],
    template: `<div
      dragAutoScroll
      [dragAutoScrollMargin]="100"
      [dragAutoScrollSpeed]="20"
      [dragAutoScrollTolerance]="10"
      style="overflow-y: auto; height: 200px"></div>`,
  })
  class CustomConfigHostComponent {}

  let fixture: ComponentFixture<CustomConfigHostComponent>;
  let doc: Document;
  let hostEl: HTMLElement;
  let rafCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    rafCallback = null;

    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        rafCallback = cb;
        return 1;
      });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
      rafCallback = null;
    });

    TestBed.configureTestingModule({
      imports: [CustomConfigHostComponent, DragAutoScrollDirective],
    });
    fixture = TestBed.createComponent(CustomConfigHostComponent);
    fixture.detectChanges();
    doc = TestBed.inject(DOCUMENT);
    hostEl = fixture.debugElement.query(
      By.directive(DragAutoScrollDirective)
    ).nativeElement;

    jest.spyOn(hostEl, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 200,
      left: 0,
      right: 300,
      width: 300,
      height: 200,
      x: 0,
      y: 0,
      toJSON() {
        return this;
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should respect custom margin — trigger scrolling at 100px from edge', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 110));
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should respect custom speed — scroll faster', () => {
    doc.dispatchEvent(createDragEvent('dragover', 150, 195));
    hostEl.scrollTop = 0;
    rafCallback!(0);
    expect(hostEl.scrollTop).toBeGreaterThan(10);
  });

  it('should respect custom tolerance — narrower horizontal bounds', () => {
    doc.dispatchEvent(createDragEvent('dragover', -15, 180));
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });
});
