import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RepeatDirective } from './repeat.directive';
import { By } from '@angular/platform-browser';

import { signal } from '@angular/core';

@Component({
  template: `
    <span
      *repeat="count(); let i = index; let first = first; let last = last"
      class="item"
      >{{ i }}-{{ first }}-{{ last }}</span
    >
  `,
  standalone: true,
  imports: [RepeatDirective],
})
class TestHostComponent {
  count = signal(3);
}

describe('RepeatDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, RepeatDirective],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the correct number of views', fakeAsync(() => {
    TestBed.tick();
    tick();
    const items = fixture.debugElement.queryAll(By.css('.item'));
    expect(items.length).toBe(3);
    expect(items[0].nativeElement.textContent.trim()).toBe('0-true-false');
    expect(items[1].nativeElement.textContent.trim()).toBe('1-false-false');
    expect(items[2].nativeElement.textContent.trim()).toBe('2-false-true');
  }));

  it('should update views when count changes', fakeAsync(() => {
    component.count.set(1);
    fixture.detectChanges();
    TestBed.tick();
    tick();
    const items = fixture.debugElement.queryAll(By.css('.item'));
    expect(items.length).toBe(1);
    expect(items[0].nativeElement.textContent.trim()).toBe('0-true-true');
  }));

  it('should clear all views if count is 0', fakeAsync(() => {
    component.count.set(0);
    fixture.detectChanges();
    TestBed.tick();
    tick();
    const items = fixture.debugElement.queryAll(By.css('.item'));
    expect(items.length).toBe(0);
  }));

  it('should handle negative repeat count as 0', fakeAsync(() => {
    component.count.set(-5);
    fixture.detectChanges();
    TestBed.tick();
    tick();
    const items = fixture.debugElement.queryAll(By.css('.item'));
    expect(items.length).toBe(0);
  }));
});
