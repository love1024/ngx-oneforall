import { Component, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';
import { DOCUMENT } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('ClickOutsideDirective', () => {
  describe('Directive is enabled', () => {
    @Component({
      imports: [ClickOutsideDirective],
      template: `<div (clickOutside)="onOutside($event)">
        <span class="inside"></span>
      </div>`,
    })
    class TestHostComponent {
      outsideEvent: Event | null = null;
      onOutside(event: Event) {
        this.outsideEvent = event;
      }
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let document: Document;
    let ngZone: NgZone;
    let hostEl: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, ClickOutsideDirective],
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
        fixture.debugElement.query(By.directive(ClickOutsideDirective))
      ).toBeTruthy();
    });

    it('should emit clickOutside when clicking outside the host element', () => {
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const event = new MouseEvent('click', { bubbles: true });
      ngZone.run(() => {
        outsideElement.dispatchEvent(event);
      });

      expect(component.outsideEvent).toBe(event);

      document.body.removeChild(outsideElement);
    });

    it('should not emit clickOutside when clicking inside the host element', () => {
      const insideElement = hostEl.querySelector('.inside') as HTMLElement;
      const event = new MouseEvent('click', { bubbles: true });
      ngZone.run(() => {
        insideElement.dispatchEvent(event);
      });

      expect(component.outsideEvent).toBeNull();
    });
  });

  describe('Directive is disabled', () => {
    @Component({
      imports: [ClickOutsideDirective],
      template: `<div
        (clickOutside)="onOutside($event)"
        [clickOutsideEnabled]="false">
        <span class="inside"></span>
      </div>`,
    })
    class TestHostComponent {
      outsideEvent: Event | null = null;
      onOutside(event: Event) {
        this.outsideEvent = event;
      }
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let document: Document;
    let ngZone: NgZone;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, ClickOutsideDirective],
      });
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      document = TestBed.inject(DOCUMENT);
      ngZone = TestBed.inject(NgZone);
      fixture.detectChanges();
    });

    it('should not emit if clickOutsideEnabled is false', () => {
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const event = new MouseEvent('click', { bubbles: true });
      ngZone.run(() => {
        outsideElement.dispatchEvent(event);
      });

      expect(component.outsideEvent).toBe(null);

      document.body.removeChild(outsideElement);
    });
  });
});
