import { Component, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';
import { DOCUMENT } from '@angular/common';

@Component({
  template: `<div clickOutside (clickOutside)="onOutside($event)">
    <span class="inside"></span>
  </div>`,
})
class TestHostComponent {
  outsideEvent: Event | null = null;
  onOutside(event: Event) {
    this.outsideEvent = event;
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let document: Document;
  let ngZone: NgZone;
  let hostEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, ClickOutsideDirective],
      providers: [NgZone],
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
      fixture.debugElement.query(
        de => !!de.injector.get(ClickOutsideDirective, null)
      )
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

  // it('should not emit if clickOutsideEnabled is false', () => {
  //   const directive = fixture.debugElement.children[0].injector.get(
  //     ClickOutsideDirective
  //   );
  //   directive.clickOutsideEnabled = false;

  //   const outsideElement = document.createElement('div');
  //   document.body.appendChild(outsideElement);

  //   const event = new MouseEvent('click', { bubbles: true });
  //   ngZone.run(() => {
  //     outsideElement.dispatchEvent(event);
  //   });

  //   expect(component.outsideEvent).toBeNull();

  //   document.body.removeChild(outsideElement);
  // });

  // it('should remove event listener on destroy', () => {
  //   const directive = fixture.debugElement.children[0].injector.get(
  //     ClickOutsideDirective
  //   );
  //   const removeListenerSpy = jest.spyOn(directive, 'removeListener');
  //   directive.ngOnDestroy();
  //   expect(removeListenerSpy).toHaveBeenCalled();
  // });
});
