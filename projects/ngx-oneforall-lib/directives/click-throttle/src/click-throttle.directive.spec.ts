import { Component, signal } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ClickThrottleDirective } from './click-throttle.directive';

@Component({
  imports: [ClickThrottleDirective],
  template: `<button
    [throttleTime]="throttle()"
    (clickThrottle)="onClick($event)">
    Click me
  </button>`,
})
class TestHostComponent {
  throttle = signal(500);
  eventCount = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick(event: Event) {
    this.eventCount++;
  }
}

describe('ClickThrottleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let button: HTMLButtonElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, ClickThrottleDirective],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  it('should create the directive', () => {
    const directive = fixture.debugElement.children[0].injector.get(
      ClickThrottleDirective
    );
    expect(directive).toBeTruthy();
  });

  it('should emit clickThrottle event on first click', fakeAsync(() => {
    button.click();
    tick();
    expect(component.eventCount).toBe(1);
  }));

  it('should throttle subsequent clicks within the throttleTime', fakeAsync(() => {
    button.click();
    tick();
    button.click();
    button.click();
    tick(499);
    expect(component.eventCount).toBe(1);
    tick(1);
    button.click();
    tick();
    expect(component.eventCount).toBe(2);
  }));

  it('should respect changes to throttleTime input', fakeAsync(() => {
    component.throttle.set(100);
    fixture.detectChanges();
    button.click();
    tick();
    button.click();
    tick(99);
    expect(component.eventCount).toBe(1);
    tick(1);
    button.click();
    tick();
    expect(component.eventCount).toBe(2);
  }));
});
