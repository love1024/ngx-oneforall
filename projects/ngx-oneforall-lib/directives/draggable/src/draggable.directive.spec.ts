import { Component, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraggableDirective, DragEvent } from './draggable.directive';
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
      dragStartEvent: DragEvent | null = null;
      dragMoveEvent: DragEvent | null = null;
      dragEndEvent: DragEvent | null = null;

      onDragStart(event: DragEvent) {
        this.dragStartEvent = event;
      }

      onDragMove(event: DragEvent) {
        this.dragMoveEvent = event;
      }

      onDragEnd(event: DragEvent) {
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

    it('should emit dragStart on mousedown', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
      });

      expect(component.dragStartEvent).not.toBeNull();
      expect(component.dragStartEvent?.x).toBe(50);
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
      expect(component.dragMoveEvent?.deltaX).toBe(50);
      expect(component.dragMoveEvent?.deltaY).toBe(50);
    });

    it('should emit dragEnd on mouseup', () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(mousedownEvent);
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

      const mousemoveEvent = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 200,
        bubbles: true,
      });

      ngZone.run(() => {
        document.dispatchEvent(mousemoveEvent);
      });

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
      dragStartEvent: DragEvent | null = null;

      onDragStart(event: DragEvent) {
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
        (dragStart)="onDragStart($event)"
        (dragMove)="onDragMove($event)"
        (dragEnd)="onDragEnd($event)">
        Touch drag
      </div>`,
    })
    class TestHostComponent {
      dragStartEvent: DragEvent | null = null;
      dragMoveEvent: DragEvent | null = null;
      dragEndEvent: DragEvent | null = null;

      onDragStart(event: DragEvent) {
        this.dragStartEvent = event;
      }

      onDragMove(event: DragEvent) {
        this.dragMoveEvent = event;
      }

      onDragEnd(event: DragEvent) {
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

    it('should emit dragStart on touchstart', () => {
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchstartEvent);
      });

      expect(component.dragStartEvent).not.toBeNull();
      expect(component.dragStartEvent?.x).toBe(50);
      expect(component.dragStartEvent?.y).toBe(50);
    });

    it('should emit dragMove on touchmove', () => {
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchstartEvent);
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

    it('should emit dragEnd on touchend', () => {
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 50, clientY: 50 } as Touch],
        bubbles: true,
        cancelable: true,
      });

      ngZone.run(() => {
        hostEl.dispatchEvent(touchstartEvent);
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
      dragMoveEvent: DragEvent | null = null;

      onDragMove(event: DragEvent) {
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

      expect(hostEl.style.position).toBe('relative');
    });
  });
});
