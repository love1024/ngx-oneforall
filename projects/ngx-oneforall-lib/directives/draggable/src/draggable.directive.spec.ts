import { Component, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraggableDirective, DraggableDragEvent } from './draggable.directive';
import { DOCUMENT } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('DraggableDirective', () => {
  describe('Basic dragging', () => {
    @Component({
      imports: [DraggableDirective],
      template: `<div
        makeDraggable
        style="position: absolute; left: 0px; top: 0px; width: 100px; height: 100px;"
        (dragStart)="onDragStart($event)"
        (dragMove)="onDragMove($event)"
        (dragEnd)="onDragEnd($event)">
        Drag me
      </div>`,
    })
    class TestHostComponent {
      dragStartEvent: DraggableDragEvent | null = null;
      dragMoveEvent: DraggableDragEvent | null = null;
      dragEndEvent: DraggableDragEvent | null = null;

      onDragStart(event: DraggableDragEvent) {
        this.dragStartEvent = event;
      }

      onDragMove(event: DraggableDragEvent) {
        this.dragMoveEvent = event;
      }

      onDragEnd(event: DraggableDragEvent) {
        this.dragEndEvent = event;
      }
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let document: Document;
    let ngZone: NgZone;
    let hostEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      document = TestBed.inject(DOCUMENT);
      ngZone = TestBed.inject(NgZone);
      fixture.detectChanges();
      hostEl = fixture.nativeElement.querySelector('div');
    });

    it('should create the directive', () => {
      expect(
        fixture.debugElement.query(By.directive(DraggableDirective))
      ).toBeTruthy();
    });

    it('should have grab cursor when enabled', () => {
      expect(hostEl.style.cursor).toBe('grab');
    });

    it('should NOT emit dragStart on mousedown alone', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      expect(component.dragStartEvent).toBeNull();
    });

    it('should emit dragStart after moving beyond threshold', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 56, // > 5px threshold
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      expect(component.dragStartEvent).not.toBeNull();
      expect(component.dragStartEvent?.x).toBe(50); // Start position
      expect(component.dragStartEvent?.y).toBe(50);
    });

    it('should emit dragMove on mousemove while dragging', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      // Start drag by moving past threshold
      const startMove = new MouseEvent('mousemove', {
        clientX: 56,
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(startMove);
      });

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      expect(component.dragMoveEvent).not.toBeNull();
      expect(component.dragMoveEvent?.x).toBe(100);
      expect(component.dragMoveEvent?.y).toBe(100);
      expect(component.dragMoveEvent?.deltaX).toBe(44); // 100 - 56
      expect(component.dragMoveEvent?.deltaY).toBe(50); // 100 - 50
    });

    it('should emit dragEnd on mouseup after dragging', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      // Start drag
      const startMove = new MouseEvent('mousemove', {
        clientX: 60,
        clientY: 60,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(startMove);
      });

      const mouseupEvent = new MouseEvent('mouseup', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mouseupEvent);
      });

      expect(component.dragEndEvent).not.toBeNull();
      expect(component.dragEndEvent?.x).toBe(100);
      expect(component.dragEndEvent?.y).toBe(100);
    });

    it('should NOT emit dragEnd if threshold not met', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      // Small move, not enough to start drag
      const smallMove = new MouseEvent('mousemove', {
        clientX: 52,
        clientY: 52,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(smallMove);
      });

      const mouseupEvent = new MouseEvent('mouseup', {
        clientX: 52,
        clientY: 52,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mouseupEvent);
      });

      expect(component.dragEndEvent).toBeNull();
    });

    it('should update element position during drag', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      // Start drag
      const startMove = new MouseEvent('mousemove', {
        clientX: 60,
        clientY: 60,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(startMove);
      });

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 200,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      // initial (0,0) + (150-50, 200-50) = (100, 150)
      // wait, startX/Y is 50,50.
      // initLeft=0, initTop=0.
      // newLeft = 0 + (150 - 50) = 100
      // newTop = 0 + (200 - 50) = 150
      expect(hostEl.style.left).toBe('100px');
      expect(hostEl.style.top).toBe('150px');
    });

    it('should not start drag on right click', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 2, // Right click
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      expect(component.dragStartEvent).toBeNull();
    });
  });

  describe('Disabled state', () => {
    @Component({
      imports: [DraggableDirective],
      template: `<div
        makeDraggable
        [makeDraggableEnabled]="false"
        style="position: absolute; left: 0px; top: 0px;"
        (dragStart)="onDragStart($event)">
        Disabled drag
      </div>`,
    })
    class TestHostComponent {
      dragStartEvent: DraggableDragEvent | null = null;

      onDragStart(event: DraggableDragEvent) {
        this.dragStartEvent = event;
      }
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let ngZone: NgZone;
    let hostEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      ngZone = TestBed.inject(NgZone);
      fixture.detectChanges();
      hostEl = fixture.nativeElement.querySelector('div');
    });

    it('should not emit dragStart when disabled', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      expect(component.dragStartEvent).toBeNull();
    });

    it('should not have grab cursor when disabled', () => {
      expect(hostEl.style.cursor).not.toBe('grab');
    });
  });

  describe('Touch events', () => {
    @Component({
      imports: [DraggableDirective],
      template: `<div
        makeDraggable
        style="position: absolute; left: 0px; top: 0px;"
        [makeDraggableEnabled]="enabled"
        (dragStart)="onDragStart($event)"
        (dragMove)="onDragMove($event)"
        (dragEnd)="onDragEnd($event)">
        Touch drag
      </div>`,
    })
    class TestHostComponent {
      enabled = true;
      dragStartEvent: DraggableDragEvent | null = null;
      dragMoveEvent: DraggableDragEvent | null = null;
      dragEndEvent: DraggableDragEvent | null = null;

      onDragStart(event: DraggableDragEvent) {
        this.dragStartEvent = event;
      }

      onDragMove(event: DraggableDragEvent) {
        this.dragMoveEvent = event;
      }

      onDragEnd(event: DraggableDragEvent) {
        this.dragEndEvent = event;
      }
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let document: Document;
    let ngZone: NgZone;
    let hostEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      document = TestBed.inject(DOCUMENT);
      ngZone = TestBed.inject(NgZone);
      fixture.detectChanges();
      hostEl = fixture.nativeElement.querySelector('div');
    });

    it('should NOT emit dragStart on touchstart alone', () => {
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchstartEvent);
      });

      expect(component.dragStartEvent).toBeNull();
    });

    it('should emit dragStart after moving beyond threshold', () => {
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchstartEvent);
      });

      const touchmoveEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 56, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(touchmoveEvent);
      });

      expect(component.dragStartEvent).not.toBeNull();
      expect(component.dragStartEvent?.x).toBe(50); // Start position
      expect(component.dragStartEvent?.y).toBe(50);
    });

    it('should emit dragMove on touchmove while dragging', () => {
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchstartEvent);
      });

      // Start drag
      const startMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 56, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(startMove);
      });

      const touchmoveEvent = new TouchEvent('touchmove', {
        touches: [{ clientX: 100, clientY: 100 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(touchmoveEvent);
      });

      expect(component.dragMoveEvent).not.toBeNull();
      expect(component.dragMoveEvent?.x).toBe(100);
      expect(component.dragMoveEvent?.y).toBe(100);
    });

    it('should emit dragEnd on touchend after dragging', () => {
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchstartEvent);
      });

      // Start drag
      const startMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 60, clientY: 60 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(startMove);
      });

      const touchendEvent = new TouchEvent('touchend', {
        touches: [],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(touchendEvent);
      });

      expect(component.dragEndEvent).not.toBeNull();
    });

    it('should NOT emit dragEnd if threshold not met', () => {
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchstartEvent);
      });

      // Small move
      const smallMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 52, clientY: 52 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(smallMove);
      });

      const touchendEvent = new TouchEvent('touchend', {
        touches: [],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(touchendEvent);
      });

      expect(component.dragEndEvent).toBeNull();
    });

    it('should not start drag with multiple touches', () => {
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [
          { clientX: 50, clientY: 50 } as Touch,
          { clientX: 100, clientY: 100 } as Touch,
        ],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchstartEvent);
      });

      expect(component.dragStartEvent).toBeNull();
    });

    it('should not start drag if disabled (touch)', () => {
      component.enabled = false;
      fixture.detectChanges();

      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        cancelable: true,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchStart);
      });

      const addSpy = jest.spyOn(document, 'addEventListener');
      expect(addSpy).not.toHaveBeenCalled();
    });

    it('should ignore move if multiple touches', () => {
      // Start drag validly
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        cancelable: true,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchStart);
      });

      // Move with 2 touches
      const touchMove = new TouchEvent('touchmove', {
        touches: [
          { clientX: 55, clientY: 50 } as Touch,
          { clientX: 60, clientY: 60 } as Touch,
        ],
        cancelable: true,
        bubbles: true,
      });

      const spy = jest.spyOn(component, 'onDragStart');
      ngZone.run(() => {
        document.dispatchEvent(touchMove);
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('should clean up listeners if drag never started (click)', () => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        cancelable: true,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchStart);
      });

      // End without moving past threshold
      const touchEnd = new TouchEvent('touchend', {
        touches: [],
        cancelable: true,
        bubbles: true,
      });

      const removeSpy = jest.spyOn(document, 'removeEventListener');
      ngZone.run(() => {
        document.dispatchEvent(touchEnd);
      });

      expect(removeSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
    });
  });

  describe('Drag target', () => {
    @Component({
      imports: [DraggableDirective],
      template: `
        <div
          #modal
          class="modal"
          style="position: absolute; left: 0px; top: 0px;">
          <div
            class="header"
            makeDraggable
            [makeDraggableTarget]="modal"
            (dragMove)="onDragMove($event)">
            Header
          </div>
          <div class="body">Content</div>
        </div>
      `,
    })
    class TestHostComponent {
      dragMoveEvent: DraggableDragEvent | null = null;

      onDragMove(event: DraggableDragEvent) {
        this.dragMoveEvent = event;
      }
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let document: Document;
    let ngZone: NgZone;
    let headerEl: HTMLElement;
    let modalEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestHostComponent);
      document = TestBed.inject(DOCUMENT);
      ngZone = TestBed.inject(NgZone);
      fixture.detectChanges();
      headerEl = fixture.nativeElement.querySelector('.header');
      modalEl = fixture.nativeElement.querySelector('.modal');
    });

    it('should move the target element instead of the handle', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        headerEl.dispatchEvent(mousedownEvent);
      });

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 200,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      expect(modalEl.style.left).toBe('100px');
      expect(modalEl.style.top).toBe('150px');
    });
  });

  describe('Static position handling', () => {
    @Component({
      imports: [DraggableDirective],
      template: `<div makeDraggable style="position: static;">
        Static element
      </div>`,
    })
    class TestHostComponent {}

    let fixture: ComponentFixture<TestHostComponent>;
    let ngZone: NgZone;
    let hostEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestHostComponent);
      ngZone = TestBed.inject(NgZone);
      fixture.detectChanges();
      hostEl = fixture.nativeElement.querySelector('div');
    });

    it('should change static position to relative when dragging starts', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      // Move past threshold to start drag
      const startMove = new MouseEvent('mousemove', {
        clientX: 60,
        clientY: 60,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(startMove);
      });

      expect(hostEl.style.position).toBe('relative');
    });
  });
  describe('Boundary constraints', () => {
    @Component({
      imports: [DraggableDirective],
      template: `
        <div
          class="container"
          style="position: relative; width: 500px; height: 500px;">
          <div
            makeDraggable
            [makeDraggableBoundary]="boundary"
            style="position: absolute; left: 0px; top: 0px; width: 100px; height: 100px;">
            Draggable
          </div>
        </div>
        <div
          class="custom-boundary"
          style="position: absolute; left: 0px; top: 0px; width: 300px; height: 300px;"></div>
      `,
    })
    class TestBoundaryComponent {
      boundary: 'viewport' | 'parent' | HTMLElement | null = null;
    }

    let fixture: ComponentFixture<TestBoundaryComponent>;
    let component: TestBoundaryComponent;
    let document: Document;
    let ngZone: NgZone;
    let hostEl: HTMLElement;

    // Polyfill DOMRect if needed
    beforeAll(() => {
      if (!window.DOMRect) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).DOMRect = class DOMRect {
          bottom: number;
          height: number;
          left: number;
          right: number;
          top: number;
          width: number;
          x: number;
          y: number;
          constructor(x = 0, y = 0, width = 0, height = 0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.left = x;
            this.right = x + width;
            this.top = y;
            this.bottom = y + height;
          }
          toJSON() {
            return JSON.stringify(this);
          }
        };
      }
    });

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestBoundaryComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestBoundaryComponent);
      component = fixture.componentInstance;
      document = TestBed.inject(DOCUMENT);
      ngZone = TestBed.inject(NgZone);
      fixture.detectChanges();
      hostEl = fixture.nativeElement.querySelector('[makeDraggable]');

      // Mock getBoundingClientRect globally for this suite using prototype
      jest
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockImplementation(function (this: HTMLElement) {
          if (this.classList.contains('custom-boundary')) {
            return {
              left: 0,
              top: 0,
              width: 300,
              height: 300,
              right: 300,
              bottom: 300,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            } as DOMRect;
          }
          if (this.classList.contains('container')) {
            return {
              left: 0,
              top: 0,
              width: 500,
              height: 500,
              right: 500,
              bottom: 500,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            } as DOMRect;
          }
          // Match host element by attribute
          if (this.hasAttribute && this.hasAttribute('makeDraggable')) {
            return {
              left: 0,
              top: 0,
              width: 100,
              height: 100,
              right: 100,
              bottom: 100,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            } as DOMRect;
          }

          return {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            right: 0,
            bottom: 0,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          } as DOMRect;
        });
    });

    it('should constrain to parent', () => {
      component.boundary = 'parent';
      fixture.detectChanges();

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      // Try to drag past the right edge (500px)
      // Element is 100px wide, so max left should be 400px
      // Drag to 600px
      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 600,
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      // 400px (max) because parent is 500px width and element is 100px width
      expect(hostEl.style.left).toBe('400px');
    });

    it('should constrain to custom element', () => {
      const customBoundary =
        fixture.nativeElement.querySelector('.custom-boundary');
      component.boundary = customBoundary;
      fixture.detectChanges();

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      // Try to drag past the right edge of custom boundary (300px)
      // Element is 100px wide, so max left should be 200px
      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 400,
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      expect(hostEl.style.left).toBe('200px');
    });

    it('should constrain to viewport', () => {
      component.boundary = 'viewport';
      fixture.detectChanges();

      // Mock window dimensions
      const mockWindow = {
        innerWidth: 800,
        innerHeight: 600,
        getComputedStyle: window.getComputedStyle.bind(window),
      };

      // We need to spy on defaultView to return our mock window properties
      // checks for defaultView in the implementation
      const originalDefaultView = document.defaultView;
      jest
        .spyOn(document, 'defaultView', 'get')
        .mockReturnValue(mockWindow as unknown as Window & typeof globalThis);

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      // Try to drag past right edge of viewport (800px)
      // Element is 100px wide, max left = 700px
      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 900,
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      expect(hostEl.style.left).toBe('700px');

      // Restore
      jest
        .spyOn(document, 'defaultView', 'get')
        .mockReturnValue(originalDefaultView);
    });

    it('should handle missing parent', () => {
      component.boundary = 'parent';
      fixture.detectChanges();

      // Remove from DOM to simulate missing parent
      // Note: this is tricky because getBoundingClientRect might fail or return 0s
      // We will override the parentElement getter on the host element
      Object.defineProperty(hostEl, 'parentElement', {
        get: () => null,
      });

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 600,
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      // Should move freely if parent is missing
      expect(hostEl.style.left).toBe('550px'); // 0 + (600 - 50) = 550
    });
  });

  describe('Dynamic inputs', () => {
    @Component({
      imports: [DraggableDirective],
      template: `
        <div
          makeDraggable
          [makeDraggableEnabled]="enabled"
          (dragStart)="onDragStart($event)">
          Dynamic Drag
        </div>
      `,
    })
    class TestDynamicComponent {
      enabled = true;
      dragStartEvent: DraggableDragEvent | null = null;

      onDragStart(event: DraggableDragEvent) {
        this.dragStartEvent = event;
      }
    }

    let fixture: ComponentFixture<TestDynamicComponent>;
    let component: TestDynamicComponent;
    let ngZone: NgZone;
    let hostEl: HTMLElement;
    let document: Document;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestDynamicComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestDynamicComponent);
      component = fixture.componentInstance;
      ngZone = TestBed.inject(NgZone);
      document = TestBed.inject(DOCUMENT);
      fixture.detectChanges();
      hostEl = fixture.nativeElement.querySelector('div');
    });

    it('should disable dragging when input changes to false', () => {
      // Initially enabled
      expect(hostEl.style.cursor).toBe('grab');

      // Disable
      component.enabled = false;
      fixture.detectChanges();
      expect(hostEl.style.cursor).not.toBe('grab');

      // Try drag
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      const moveEvent = new MouseEvent('mousemove', {
        clientX: 60,
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(moveEvent);
      });

      expect(component.dragStartEvent).toBeNull();
    });

    it('should enable dragging when input changes to true', () => {
      component.enabled = false;
      fixture.detectChanges();
      expect(hostEl.style.cursor).not.toBe('grab');

      // Enable
      component.enabled = true;
      fixture.detectChanges();
      expect(hostEl.style.cursor).toBe('grab');

      // Try drag
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      const moveEvent = new MouseEvent('mousemove', {
        clientX: 60,
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(moveEvent);
      });

      expect(component.dragStartEvent).not.toBeNull();
    });
  });

  describe('Coverage Edge Cases', () => {
    @Component({
      imports: [DraggableDirective],
      template: `<div
        makeDraggable
        [makeDraggableBoundary]="boundary"
        style="position: absolute;">
        Test
      </div>`,
    })
    class TestHostComponent {
      boundary: string | null = null;
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let hostEl: HTMLElement;
    let ngZone: NgZone;
    let document: Document;
    let component: TestHostComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestHostComponent);
      ngZone = TestBed.inject(NgZone);
      document = TestBed.inject(DOCUMENT);
      component = fixture.componentInstance;
      fixture.detectChanges();
      hostEl = fixture.nativeElement.querySelector('div');

      // Add boundary support mock
      jest
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockImplementation(function (this: HTMLElement) {
          return {
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          } as DOMRect;
        });
    });

    it('should handle empty/invalid style values gracefully (fallback to 0)', () => {
      // Override prototype mock to handle parent specially by this (instance) comparison.
      // This is needed because the beforeEach prototype spy overrides instance spies on the prototype method.
      const parent = hostEl.parentElement;
      (
        HTMLElement.prototype.getBoundingClientRect as jest.Mock
      ).mockImplementation(function (this: HTMLElement) {
        if (this === parent) {
          return {
            left: 0,
            top: 0,
            width: 500,
            height: 500,
            right: 500,
            bottom: 500,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          } as DOMRect;
        }
        // Default behavior (for host element)
        return {
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          right: 100,
          bottom: 100,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      });

      // Mock getComputedStyle for host element
      jest.spyOn(window, 'getComputedStyle').mockImplementation(() => {
        // Return mostly valid style but with invalid left/top
        return {
          left: '',
          top: 'invalid', // parseFloat('invalid') -> NaN
          position: 'absolute',
          getPropertyValue: () => '',
        } as unknown as CSSStyleDeclaration;
      });

      // Enable boundary to force calculation
      component.boundary = 'parent';
      fixture.detectChanges();

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 0,
        clientY: 0,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 10,
        clientY: 10,
        bubbles: true,
      });

      // This will call applyBoundaryConstraints
      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      // Element should still move correctly (starting from 0,0)
      // If NaN was not handled, it might result in NaNpx or similar
      expect(hostEl.style.left).toBe('10px');
      expect(hostEl.style.top).toBe('10px');

      // cleanup mock
      (window.getComputedStyle as unknown as jest.Mock).mockRestore();
    });

    it('should handle undefined viewport dimensions', () => {
      // Restore original properties after test if needed, but jest usually resets logic.
      // But property definitions on window might persist if not careful.
      const originalInnerWidth = Object.getOwnPropertyDescriptor(
        window,
        'innerWidth'
      );
      const originalInnerHeight = Object.getOwnPropertyDescriptor(
        window,
        'innerHeight'
      );

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: undefined,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        value: undefined,
      });

      component.boundary = 'viewport';
      fixture.detectChanges();

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 0,
        clientY: 0,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 10,
        clientY: 10,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

      // Viewport 0x0
      // logical viewport rect: 0,0,0,0
      // target: 100x100
      // minLeft = 0 - naturalLeft(0) = 0
      // maxLeft = 0 - 100 - 0 = -100
      // newLeft calculated as 10.
      // constrained: max(0, min(-100, 10)) -> max(0, -100) -> 0
      expect(hostEl.style.left).toBe('0px');
      expect(hostEl.style.top).toBe('0px');

      // Restore
      if (originalInnerWidth)
        Object.defineProperty(window, 'innerWidth', originalInnerWidth);
      if (originalInnerHeight)
        Object.defineProperty(window, 'innerHeight', originalInnerHeight);
    });
  });

  describe('Dynamic inputs', () => {
    @Component({
      imports: [DraggableDirective],
      template: `
        <div
          makeDraggable
          [makeDraggableEnabled]="enabled"
          (dragStart)="onDragStart($event)">
          Dynamic Drag
        </div>
      `,
    })
    class TestDynamicComponent {
      enabled = true;
      dragStartEvent: DraggableDragEvent | null = null;

      onDragStart(event: DraggableDragEvent) {
        this.dragStartEvent = event;
      }
    }

    let fixture: ComponentFixture<TestDynamicComponent>;
    let component: TestDynamicComponent;
    let ngZone: NgZone;
    let hostEl: HTMLElement;
    let document: Document;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestDynamicComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestDynamicComponent);
      component = fixture.componentInstance;
      ngZone = TestBed.inject(NgZone);
      document = TestBed.inject(DOCUMENT);
      fixture.detectChanges();
      hostEl = fixture.nativeElement.querySelector('div');
    });

    it('should disable dragging when input changes to false', () => {
      // Initially enabled
      expect(hostEl.style.cursor).toBe('grab');

      // Disable
      component.enabled = false;
      fixture.detectChanges();
      expect(hostEl.style.cursor).not.toBe('grab');

      // Try drag
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      const moveEvent = new MouseEvent('mousemove', {
        clientX: 60, // Past threshold
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(moveEvent);
      });

      expect(component.dragStartEvent).toBeNull();
    });

    it('should enable dragging when input changes to true', () => {
      component.enabled = false;
      fixture.detectChanges();
      expect(hostEl.style.cursor).not.toBe('grab');

      // Enable
      component.enabled = true;
      fixture.detectChanges();
      expect(hostEl.style.cursor).toBe('grab');

      // Try drag
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      const moveEvent = new MouseEvent('mousemove', {
        clientX: 60, // Past threshold
        clientY: 50,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(moveEvent);
      });

      expect(component.dragStartEvent).not.toBeNull();
    });
  });

  describe('Lifecycle and cleanup', () => {
    @Component({
      imports: [DraggableDirective],
      template: `<div makeDraggable>Drag me</div>`,
    })
    class TestHostComponent {}

    let fixture: ComponentFixture<TestHostComponent>;
    let hostEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, DraggableDirective],
      });
      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      hostEl = fixture.nativeElement.querySelector('div');
    });

    it('should remove listeners on destroy', () => {
      const startSpy = jest.spyOn(hostEl, 'removeEventListener');
      const docSpy = jest.spyOn(document, 'removeEventListener');

      fixture.destroy();

      expect(startSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(startSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

      // Also ensure drag listeners are removed just in case
      expect(docSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(docSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });
  });
});
